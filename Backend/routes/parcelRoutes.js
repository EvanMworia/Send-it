// const express = require('express');

// const { getAllParcels, getParcelById, createParcel, updateParcel, deleteParcel,getUserParcels, getUsersReceivingParcels, getUsersSendingParcels } = require('../controllers/parcelController');
import express from 'express';
import { getAllParcels, getParcelById, createParcel, updateParcel, deleteParcel,getUserParcels, getUsersReceivingParcels, getUsersSendingParcels,verifyPayment } from '../controllers/parcelController.js';

 const parcelRouter= express.Router();

// Controller functions (you need to create these functions in your controllers)

// Routes
parcelRouter.get('/parcels', getAllParcels);
parcelRouter.get('/parcels/:id', getParcelById);
parcelRouter.post('/parcels', createParcel);
parcelRouter.get('/verify-payment', verifyPayment);
parcelRouter.put('/parcels/update', updateParcel);
parcelRouter.put('/parcels/:id', deleteParcel);


parcelRouter.get('/parcels/user/:userId',getUserParcels);

parcelRouter.get('/parcels/sending/:senderID', getUsersSendingParcels);
parcelRouter.get('/parcels/receiving/:receiverID', getUsersReceivingParcels);

 export default parcelRouter;