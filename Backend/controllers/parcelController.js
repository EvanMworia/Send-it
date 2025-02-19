import { validateParcel, validateDelete, validateStatus } from '../models/parcelModel.js';
import { DbHelper } from '../Database/DbHelper.js';
import Stripe from 'stripe';
import fetch from 'node-fetch'; // Ensure this is installed
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const db =new DbHelper();


const CLIENT_URL = process.env.CLIENT_URL 
// Function to geocode a location name into coordinates using Nominatim
const geocodeLocation = async (location) => {
    try {
        const geocodingUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
        const response = await fetch(geocodingUrl);

        if (!response.ok) {
            throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error(`Geocoding failed for location: ${location}`);
        }

        const { lat, lon } = data[0];
        return [parseFloat(lat), parseFloat(lon)]; // Return as [latitude, longitude]
    } catch (error) {
        console.error("Error geocoding location:", error);
        throw error; // Re-throw the error for the calling function to handle
    }
};

// Function to calculate distance using OSRM
const calculateDistance = async (startCoords, endCoords) => {
    try {
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?overview=full`;
        const response = await fetch(osrmUrl);

        if (!response.ok) {
            throw new Error(`OSRM API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.code !== 'Ok') {
            throw new Error(`OSRM API returned an error: ${data.code}`);
        }

        if (!data.routes || data.routes.length === 0) {
            throw new Error("No route found by OSRM");
        }

        return data.routes[0].distance / 1000; // Convert to kilometers
    } catch (error) {
        console.error("Error calculating distance:", error);
        throw error; // Re-throw the error for the calling function to handle
    }
};

// Function to calculate price based on distance
const calculatePrice = (distance) => {
    const ratePerKilometer = 0.75; // Example rate per kilometer
    const baseFee = 7.00; // Example base fee
    const price = baseFee + (distance * ratePerKilometer);
    return price;
};

// Controller function to create a parcel and initiate Stripe payment
async function createParcel  (req, res) {
    try {
        // Validate incoming request data using the existing validateParcel function
        const { error, value } = validateParcel(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.details.map(detail => ({
                    field: detail.path[0],
                    message: detail.message
                }))
            });
        }

        // Destructure the validated data
        const { senderEmail, senderPhone, receiverEmail, receiverPhone, SendingLocation, PickupLocation } = value;

        // --- Geocode Locations ---
        let sendingCoordinates;
        let pickupCoordinates;

        try {
            sendingCoordinates = await geocodeLocation(SendingLocation);
            pickupCoordinates = await geocodeLocation(PickupLocation);
        } catch (geocodingError) {
            return res.status(500).json({
                success: false,
                message: "Error geocoding locations",
                error: geocodingError.message,
            });
        }

        console.log(`Geocoded Sending Location: ${sendingCoordinates}`);
        console.log(`Geocoded Pickup Location: ${pickupCoordinates}`);

        // --- Calculate Distance and Price ---
        let distance;
        let price;

        try {
            distance = await calculateDistance(sendingCoordinates, pickupCoordinates);
            price = calculatePrice(distance);
        } catch (distanceError) {
            return res.status(500).json({
                success: false,
                message: "Error calculating distance or price",
                error: distanceError.message,
            });
        }

        console.log(`Distance: ${distance} km, Price: $${price.toFixed(2)}`);

        // --- Create Stripe Checkout Session ---
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd', // Or your preferred currency
                    product_data: {
                        name: 'Parcel Delivery',
                        description: `Delivery from ${SendingLocation} to ${PickupLocation} (${distance.toFixed(2)} km)`,
                    },
                    unit_amount: Math.round(price * 100), // Amount in cents
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`, // Replace with your success URL
            cancel_url: `${CLIENT_URL}/cancel`, // Replace with your cancel URL
            metadata: {
                senderEmail,
                receiverEmail,
                SendingLocation,
                PickupLocation,
            },
        });

        // --- Execute the stored procedure to create a new parcel ---
        let results = await db.executeProcedure("UpsertParcel", {
            ParcelID: null, // NULL for new parcels
            SenderEmail: senderEmail,
            SenderPhone: senderPhone,
            ReceiverEmail: receiverEmail,
            ReceiverPhone: receiverPhone,
            SendingLocation,
            PickupLocation,
            Status: "Pending", // Update status
            Price: price,
            Session: session.id, // Store the Stripe Session ID
        });

        console.log("Procedure Result:", results);

        res.status(200).json({
            success: true,
            message: "Stripe session created",
            sessionId: session.id,
            stripeUrl: session.url
        });

    } catch (error) {
        console.error("Error creating parcel:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const getAllParcels = async (req, res) => {
	try {
		const { senderID, receiverID, status } = req.query;

		const result = await db.executeProcedure('GetAllParcels', {
			SenderID: senderID || null,
			ReceiverID: receiverID || null,
			Status: status || null,
		});
		
		
			res.status(200).json({
				success: true,
				data: result.recordset, // Return fetched parcels
			});
		
	} catch (error) {
		console.error('Error fetching parcels:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
			error: error.message,
		});
	}
};

async function getParcelById(req, res) {
	try {
		const { id } = req.params; // Extract parcel ID from route parameters

		if (!id) {
			return res.status(400).json({
				success: false,
				message: 'Parcel ID is required',
			});
		}

		const results = await db.executeProcedure('sp_GetParcelByID', { ParcelID: id });
		console.log('Results:', results);

		if (!results.recordset.length) {
			return res.status(404).json({
				success: false,
				message: 'Parcel not found',
			});
		} else {
			res.status(200).json({
				success: true,
				data: results.recordset[0], // Return fetched parcel
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Internal server error',
			error: error.message,
		});
	}
}

async function updateParcel(req, res) {
	try {
		console.log('Request Body:', req.body);
		// Validate input data
		const { error, value } = validateStatus(req.body);
		if (error) {
			return res.status(400).json({
				success: false,
				message: 'Validation failed',
				errors: error.details.map((err) => err.message),
			});
		}

		const { parcelId, status } = value;

		// Execute the stored procedure to update status
		let results = await db.executeProcedure('UpsertParcel', {
			ParcelID: parcelId,
			SenderID: null, // Not needed for update
			ReceiverID: null, // Not needed for update
			SendingLocation: null, // Not needed for update
			PickupLocation: null, // Not needed for update
			Status: status,
		});

		console.log('Procedure Result:', results);
		const parcelDetails = (await db.executeProcedure('sp_GetParcelByID', { parcelId })).recordset;
		// Check if the update was successful
		if (results.rowsAffected[0] > 0) {
			res.status(200).json({
				success: true,
				message: `Parcel status updated to ${status}.`,
			});
			sendUpdateEmail(parcelId, status);
		} else {
			res.status(404).json({
				success: false,
				message: 'Parcel not found or status update failed.',
			});
		}
	} catch (error) {
		console.error('Error updating parcel status:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
			error: error.message,
		});
	}
}

async function deleteParcel(req, res) {
	try {
		console.log('Request Body:', req.body); // Debugging

		// Validate input data
		const { error, value } = validateDelete(req.params);
		if (error) {
			return res.status(400).json({
				success: false,
				message: 'Validation failed',
				errors: error.details.map((err) => err.message),
			});
		}

		const { parcelId } = value;

		// Execute the stored procedure for soft deletion
		let results = await db.executeProcedure('SoftDeleteParcel', { ParcelID: parcelId });

		console.log('Procedure Result:', results);

		if (results.rowsAffected[0] > 0) {
			res.status(200).json({
				success: true,
				message: 'Parcel has been soft deleted.',
			});
		} else {
			res.status(404).json({
				success: false,
				message: 'Parcel not found or already deleted.',
			});
		}
	} catch (error) {
		console.error('Error deleting parcel:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
			error: error.message,
		});
	}
}

async function getUserParcels(req, res) {}

async function getUsersSendingParcels(req, res) {
	try {
		const { senderID } = req.params; // Extract sender ID from route parameters

		if (!senderID) {
			return res.status(400).json({
				success: false,
				message: 'Sender ID is required',
			});
		}

		// Execute the stored procedure, filtering only by SenderID
		const result = await db.executeProcedure('GetAllParcels', {
			SenderID: senderID,
			ReceiverID: null,
			Status: null,
		});

		if (!result.recordset.length) {
			return res.status(404).json({
				success: false,
				message: 'No parcels found',
			});
		} else {
			res.status(200).json({
				success: true,
				data: result.recordset, // Return fetched parcels
			});
		}
	} catch (error) {
		console.error('Error fetching parcels by sender:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
			error: error.message,
		});
	}
}

async function getUsersReceivingParcels(req, res) {
	try {
		const { receiverID } = req.params; // Extract sender ID from route parameters

		if (!receiverID) {
			return res.status(400).json({
				success: false,
				message: 'Receiver ID is required',
			});
		}

		// Execute the stored procedure, filtering only by ReceiverID
		const result = await db.executeProcedure('GetAllParcels', {
			SenderID: null,
			ReceiverID: receiverID,
			Status: null,
		});

		if (!result.recordset.length) {
			return res.status(404).json({
				success: false,
				message: 'No parcels found',
			});
		} else {
			res.status(200).json({
				success: true,
				data: result.recordset, // Return fetched parcels
			});
		}
	} catch (error) {
		console.error('Error fetching parcels by sender:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
			error: error.message,
		});
	}
}

export {
	getAllParcels,
	getParcelById,
	createParcel,
	updateParcel,
	deleteParcel,
	getUserParcels,
	getUsersSendingParcels,
	getUsersReceivingParcels,
};
