// const express = require('express');

// const { getAllParcels, getParcelById, createParcel, updateParcel, deleteParcel,getUserParcels, getUsersReceivingParcels, getUsersSendingParcels } = require('../controllers/parcelController');
import express from 'express';
import {
	getAllParcels,
	getParcelById,
	createParcel,
	updateParcel,
	deleteParcel,
	getUsersReceivingParcels,
	getUsersSendingParcels,
} from '../controllers/parcelController.js';

const parcelRouter = express.Router();

// Controller functions (you need to create these functions in your controllers)

// Routes
parcelRouter.get('/parcels', getAllParcels); //updated to get by Email
parcelRouter.get('/parcels/:id', getParcelById); //looks okay not touched
parcelRouter.post('/parcels', createParcel); //updated to create parcel by using Emails
parcelRouter.put('/parcels/update', updateParcel); //----RECHECK THIS ROUTE
parcelRouter.put('/parcels/:parcelId', deleteParcel);

parcelRouter.get('/parcels/sending/:senderEmail', getUsersSendingParcels); //updated to use email instead
parcelRouter.get('/parcels/receiving/:receiverEmail', getUsersReceivingParcels); //updated to use email instead

export default parcelRouter;
