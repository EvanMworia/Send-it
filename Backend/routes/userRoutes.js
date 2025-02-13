import express from 'express';
import {
	getUsers,
	DeleteUser,
	registerNewUser,
	GetUserById,
	GetUserByEmail,
	login,
} from '../controllers/userController.js';
import { authenticateJWT } from '../middleware/authMiddlewares.js';
const userRouter = express.Router();

userRouter.post('/registerUser', registerNewUser);
userRouter.post('/login', login);
userRouter.get('/getAllUsers', authenticateJWT, getUsers);
userRouter.get('/getUserById/:id', GetUserById);
userRouter.get('/getUserByEmail/:email', GetUserByEmail);

userRouter.delete('/deleteUser/:id', DeleteUser);

export default userRouter;
