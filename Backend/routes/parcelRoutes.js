const express = require('express');
const { getAllParcels, getParcelById, createParcel, updateParcel, deleteParcel } = require('../controllers/parcelController');

const router = express.Router();

// Controller functions (you need to create these functions in your controllers)

// Routes
router.get('/parcels', getAllParcels);
router.get('/parcels/:id', getParcelById);
router.post('/parcels', createParcel);
router.put('/parcels/:id', updateParcel);
router.put('/parcels/:id', deleteParcel);
router.get('/parcels/:userId',getUserParcels); 

module.exports = router;