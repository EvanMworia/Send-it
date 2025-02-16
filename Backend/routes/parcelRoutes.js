// const express = require('express');

// const { getAllParcels, getParcelById, createParcel, updateParcel, deleteParcel,getUserParcels, getUsersReceivingParcels, getUsersSendingParcels } = require('../controllers/parcelController');
import express from 'express';
import { getAllParcels, getParcelById, createParcel, updateParcel, deleteParcel,getUserParcels, getUsersReceivingParcels, getUsersSendingParcels } from '../controllers/parcelController.js';

 const parcelRouter= express.Router();

// Controller functions (you need to create these functions in your controllers)

// Routes
parcelRouter.get('/parcels', getAllParcels);
parcelRouter.get('/parcels/:id', getParcelById);
parcelRouter.post('/parcels', createParcel);
parcelRouter.put('/parcels/update', updateParcel);
parcelRouter.put('/parcels/:parcelId', deleteParcel);


parcelRouter.get('/parcels/user/:userId',getUserParcels);

parcelRouter.get('/parcels/sending/:senderID', getUsersSendingParcels);
parcelRouter.get('/parcels/receiving/:receiverID', getUsersReceivingParcels);

 export default parcelRouter;