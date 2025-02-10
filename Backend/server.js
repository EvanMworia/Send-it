import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRoutes.js';
import parcelRouter from './routes/parcelRoutes.js';

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(express.json()); // Parse JSON requests

// Routes
app.use('/users', userRouter);
app.use('/parcels', parcelRouter);



// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
