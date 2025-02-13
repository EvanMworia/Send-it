import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors';
// import userRouter from './routes/userRoutes.js';
import parcelRouter from './routes/parcelRoutes.js';

const app = express();
app.use(json()); // P
// Middleware
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
//arse JSON requests

app.use(express.urlencoded({ extended: true })); // Middleware to parse form data

// Routes
// app.use('/users', userRouter);

// app.use('/', parcelRouter);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
