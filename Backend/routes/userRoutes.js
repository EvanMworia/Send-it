import express from 'express';
import { getUsers, DeleteUser, registerNewUser, GetUserById } from '../controllers/userController.js';
const userRouter = express.Router();

userRouter.post('/registerUser', registerNewUser);
userRouter.get('/getAllUsers', getUsers);
userRouter.get('/findUser/:id', GetUserById);
userRouter.delete('/deleteUser/:id', DeleteUser);

export default userRouter;
