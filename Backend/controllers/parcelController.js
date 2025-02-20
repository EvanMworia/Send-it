import { validateParcel, validateDelete, validateStatus } from '../models/parcelModel.js';
import { DbHelper } from '../Database/DbHelper.js';
import Stripe from 'stripe';
import fetch from 'node-fetch'; // Ensure this is installed
import { notifyParcelRecepient, notifyParcelSender } from '../services/emailService.js';
import { sendSMSToRecepient } from '../services/smsService.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const db =new DbHelper();


const CLIENT_URL = process.env.CLIENT_URL;

// Geocode a location into coordinates using Nominatim
const geocodeLocation = async (location) => {
    try {
        const geocodingUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
        const response = await fetch(geocodingUrl);
        if (!response.ok) throw new Error(`Geocoding API error: ${response.statusText}`);
        
        const data = await response.json();
        if (!data.length) throw new Error(`Geocoding failed for location: ${location}`);

        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    } catch (error) {
        console.error("Error geocoding location:", error);
        throw error;
    }
};

// Calculate distance using OSRM
const calculateDistance = async (startCoords, endCoords) => {
    try {
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?overview=full`;
        const response = await fetch(osrmUrl);
        if (!response.ok) throw new Error(`OSRM API error: ${response.statusText}`);

        const data = await response.json();
        if (data.code !== 'Ok' || !data.routes.length) throw new Error("No route found");

        return data.routes[0].distance / 1000; // Convert meters to km
    } catch (error) {
        console.error("Error calculating distance:", error);
        throw error;
    }
};

// Calculate price based on distance
const calculatePrice = (distance) => {
    const ratePerKm = 0.75;
    const baseFee = 7.00;
    return baseFee + (distance * ratePerKm);
};

// Create Parcel and Initiate Stripe Payment
const createParcel = async (req, res) => {
    try {
        console.log("Received request:", req.body); // Debugging line

  

        const { senderEmail, senderPhone, receiverEmail, receiverPhone, SendingLocation, PickupLocation } = req.body;

        // Geocode locations
        let sendingCoordinates, pickupCoordinates;
        try {
            sendingCoordinates = await geocodeLocation(SendingLocation);
            pickupCoordinates = await geocodeLocation(PickupLocation);
        } catch (err) {
            return res.status(500).json({ success: false, message: "Geocoding error", error: err.message });
        }

        // Calculate distance and price
        let distance, price;
        try {
            distance = await calculateDistance(sendingCoordinates, pickupCoordinates);
            price = calculatePrice(distance);
        } catch (err) {
            return res.status(500).json({ success: false, message: "Distance/Price calculation error", error: err.message });
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Parcel Delivery',
                        description: `Delivery from ${SendingLocation} to ${PickupLocation} (${distance.toFixed(2)} km)`,
                    },
                    unit_amount: Math.round(price * 100),
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${CLIENT_URL}/cancel`,
            metadata: {
                senderEmail,
                senderPhone,
                receiverEmail,
                receiverPhone,
                SendingLocation,
                PickupLocation,
            },
        });

        res.status(200).json({
            success: true,
            message: "Stripe session created",
            sessionId: session.id,
            stripeUrl: session.url
        });
    } catch (error) {
        console.error("Error creating parcel:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

// Verify Stripe Payment and Create Parcel
const verifyPayment = async (req, res) => {
    try {
        const { session_id } = req.query;
        if (!session_id) return res.status(400).json({ success: false, message: "Session ID is required" });

        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (session.payment_status !== "paid") return res.status(400).json({ success: false, message: "Payment was not successful" });

        // Insert parcel into database
        let results = await db.executeProcedure("UpsertParcel", {
            ParcelID: null,
            SenderEmail: session.metadata.senderEmail,
            SenderPhone: session.metadata.senderPhone,
            ReceiverEmail: session.metadata.receiverEmail,
            ReceiverPhone: session.metadata.receiverPhone,
            SendingLocation: session.metadata.SendingLocation,
            PickupLocation: session.metadata.PickupLocation,
            Status: "Pending",
            Price: session.amount_total / 100,
            Session: session.id,
        });

        res.status(200).json({ success: true, message: "Parcel created successfully", results });
		notifyParcelRecepient(session.metadata.senderEmail, session.metadata.receiverEmail, session.metadata.PickupLocation);
		notifyParcelSender(session.metadata.senderEmail, session.metadata.receiverEmail, session.metadata.PickupLocation);
		//sendSMSToRecepient(session.metadata.senderEmail, session.metadata.receiverPhone, session.metadata.PickupLocation);
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
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

		const { ParcelID, status } = value;

		// Execute the stored procedure to update status
		let results = await db.executeProcedure('UpsertParcel', {
			ParcelID: ParcelID,
            SenderEmail: null,
            SenderPhone: null,
            ReceiverEmail: null,
            ReceiverPhone: null,
            SendingLocation: null,
            PickupLocation: null,
            Status: status,
            Price: null,
            Session: null,
		});
		res.status(201).json({
			success: true,
			message: 'Parcel updated successfully',
		});
		
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

		const { ParcelID } = value;

		// Execute the stored procedure for soft deletion
		let results = await db.executeProcedure('SoftDeleteParcel', { ParcelID });

		res.status(201).json({
			success: true,
			message: 'Parcel deleted successfully',
		});
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
    verifyPayment,
};
