import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors';
import userRouter from './routes/userRoutes.js';
import parcelRouter from './routes/parcelRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';

const app = express();
app.use(express.static('public')); // Serve static files (frontend)
// app.use(express.json);
app.use(json()); // Parse JSON requests
// Middleware
// app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(cors());

// app.use(express.urlencoded({ extended: true })); // Middleware to parse form data

// Routes
app.use('/users', userRouter);

app.use('/', parcelRouter);

app.use('/payment', paymentRouter);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
