import { validateParcel, validateDelete, validateStatus } from '../models/parcelModel.js';
import { DbHelper } from '../Database/DbHelper.js';
import { sendUpdateEmail } from '../services/emailService.js';

const db = new DbHelper();

const getAllParcels = async (req, res) => {
	try {
		const { senderID, receiverID, status } = req.query;

		const result = await db.executeProcedure('GetAllParcels', {
			SenderID: senderID || null,
			ReceiverID: receiverID || null,
			Status: status || null,
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
async function createParcel(req, res) {
	try {
		// Validate incoming request data using the Joi schema
		const { error, value } = validateParcel(req.body);

		if (error) {
			// If validation fails, return 400 with validation errors
			return res.status(400).json({
				success: false,
				message: 'Validation error',
				errors: error.details.map((detail) => ({
					field: detail.path[0],
					message: detail.message,
				})),
			});
		}

		// Destructure the validated data
		const { senderId, receiverId, sendingLocation, pickupLocation } = value;

		// Execute the stored procedure to create a new parcel
		let results = await db.executeProcedure('UpsertParcel', {
			ParcelID: null, // NULL for new parcels
			SenderID: senderId,
			ReceiverID: receiverId,
			SendingLocation: sendingLocation,
			PickupLocation: pickupLocation,
			Status: 'Pending',
		});

		console.log('Procedure Result:', results);

		res.status(201).json({
			success: true,
			message: 'Parcel created successfully',
		});
	} catch (error) {
		console.error('Error creating parcel:', error);
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
