import { validateParcel, validateDelete, validateStatus } from '../models/parcelModel.js';
import { DbHelper } from '../Database/DbHelper.js';
import { notifyParcelRecepient, notifyParcelSender, sendUpdateEmail } from '../services/emailService.js';
import { v4 as uid } from 'uuid';

const db = new DbHelper();

const getAllParcels = async (req, res) => {
	try {
		const { senderEmail, receiverEmail, status } = req.query;

		const result = await db.executeProcedure('GetAllParcels', {
			SenderEmail: senderEmail || null,
			ReceiverEmail: receiverEmail || null,
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

		let parcelId = uid();
		// Destructure the validated data
		const { senderEmail, receiverEmail, sendingLocation, pickupLocation } = value;

		// Execute the stored procedure to create a new parcel
		let results = await db.executeProcedure('UpdinsParcel', {
			ParcelID: parcelId,
			SenderEmail: senderEmail,
			ReceiverEmail: receiverEmail,
			SendingLocation: sendingLocation,
			PickupLocation: pickupLocation,
			Status: 'Pending',
		});

		console.log('Procedure Result:', results);

		res.status(201).json({
			success: true,
			message: 'Parcel created successfully',
		});
		//SHOULD SEND A NOTIFICATION EMAIL HERE
		await notifyParcelRecepient(senderEmail, receiverEmail, parcelId, pickupLocation);
		await notifyParcelSender(senderEmail, receiverEmail, parcelId, pickupLocation);
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
			SenderEmail: null, // Not needed for update
			ReceiverEmail: null, // Not needed for update
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
			// sendUpdateEmail(parcelId, status);
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

//=============SHOULD BE GET PARCELS ASSOCIATED BY SENDER EMAIL=========================
async function getUsersSendingParcels(req, res) {
	try {
		const { senderEmail } = req.params; // Extract senderEmail from route parameters

		if (!senderEmail) {
			return res.status(400).json({
				success: false,
				message: 'Sender Email is required',
			});
		}

		// Execute the stored procedure, filtering only by SenderID
		const result = await db.executeProcedure('GetAllParcels', {
			SenderEmail: senderEmail,
			ReceiverEmail: null,
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
		const { receiverEmail } = req.params; // Extract receiverEmail from route parameters

		if (!receiverEmail) {
			return res.status(400).json({
				success: false,
				message: 'receiverEmail is required',
			});
		}

		// Execute the stored procedure, filtering only by receiverEmail
		const result = await db.executeProcedure('GetAllParcels', {
			SenderEmail: null,
			ReceiverEmail: receiverEmail,
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
	getUsersSendingParcels,
	getUsersReceivingParcels,
};
