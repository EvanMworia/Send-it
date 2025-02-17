import { DbHelper } from '../Database Helper/dbHelper.js';
import { registerUserSchema } from '../utils/validation.js';
import { v4 as uid } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url'; //HELPER TO LOCATE OUR POSITION OF DB.JS
import { sendWelcomeEmail } from '../services/emailService.js';

//GETTING OUR CURRENT LOCATION(of the file (in this case db.js))
const __filename = fileURLToPath(import.meta.url);
//GETTING THE LOCATION OF THE DIRECTORY WE ARE IN(config)
const __dirname = path.dirname(__filename);
//POINTING TO THE .ENV FILE SO WE CAN EXTRACT THE VARIABLES IIN THERE
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const db = new DbHelper();
console.log('shdddd', process.env.JWT_SECRET);
export async function registerNewUser(req, res) {
	try {
		//validate the request body against the defined schema
		const { error } = registerUserSchema.validate(req.body);
		//if any error in matters validation, stop execution and infor user of the error.
		if (error) {
			return res.status(400).json({ message: `${error.message}` });
		}

		//if validation is valid, extract the things we need from the body
		const { FullName, Email, Password, ProfilePicture, Phone, Role } = req.body;

		const existingEmail = await db.executeProcedure('GetUserByEmail', { Email: Email });
		console.log(existingEmail);

		if (existingEmail.length > 0) {
			return res.status(400).json({ message: 'Email is already in use' });
		}
		const UserID = uid();
		const hashedPassword = await bcrypt.hash(Password, 10);
		console.log(hashedPassword);

		await db.executeProcedure('CreateNewUser', {
			UserID,
			FullName,
			Email,
			PasswordHash: hashedPassword,
			ProfilePicture,
			Phone,
			Role,
		});
		res.status(201).json({
			message: `User ${FullName} has been created successfully`,
		});
		sendWelcomeEmail(Email, FullName);
	} catch (error) {
		console.error('Error happened ', error);
		res.status(500).json({ message: 'Server Error' });
	}
}
// export async function login(req, res) {
// 	const { Email, Password } = req.body;
// 	const userFound = (await db.executeProcedure('GetUserByEmail', { Email })).recordset;
// 	if (userFound.length !== 0) {
// 		console.log('FOUNNNDDD');
// 		const isPasswordMatch = await bcrypt.compare(Password, userFound[0].Password);
// 		if (isPasswordMatch) {
// 			console.log('Passwords MATCH');
// 			// Generate JWT Token
// 			const token = jwt.sign({ userId: user.UserID, role: user.Role }, process.env.JWT_SECRET, {
// 				expiresIn: '1h',
// 			});

// 			res.json({ message: 'Login successful', token });
// 		} else {
// 			console.log('Invalid Credentials');
// 		}
// 		return res.status(200).json(userFound);
// 	}

// 	console.log('No one was found');
// 	return res.status(404).json({ message: `Invalid Credentials` });
// }

export async function login(req, res) {
	try {
		const { Email, Password } = req.body;
		const userFound = (await db.executeProcedure('GetUserByEmail', { Email })).recordset;

		if (userFound.length === 0) {
			console.log('No one was found');
			return res.status(404).json({ message: 'Invalid Credentials' });
		}

		console.log('FOUNNNDDD');
		const user = userFound[0];

		// Compare password
		const isPasswordMatch = await bcrypt.compare(Password, user.Password);
		if (!isPasswordMatch) {
			console.log('Invalid Credentials');
			return res.status(401).json({ message: 'Invalid Credentials' });
		}

		console.log('Passwords MATCH');

		// Generate JWT Token
		const token = jwt.sign({ userId: user.UserID, role: user.Role }, process.env.JWT_SECRET, {
			expiresIn: '1h',
		});

		return res.json({ message: 'Login successful', token });
	} catch (error) {
		console.error('Error logging in:', error);
		return res.status(500).json({ message: 'Server Error' });
	}
}
export async function getUsers(req, res) {
	try {
		let results = await db.executeProcedure('getAllUsers', {});
		//console.log(results);
		// return results;
		res.status(200).json(results.recordset);
	} catch (error) {
		console.error('❌ Error fetching users:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}
export async function DeleteUser(req, res) {
	try {
		const { id } = req.params;
		const foundUser = await db.executeProcedure('GetUserById', { UserID: id });
		if (!foundUser) {
			res.status(404).json({ message: 'No user was found with that id' });
		}
		await db.executeProcedure('SoftDeleteUser', { UserID: id });
		res.status(200).json({ message: `${foundUser.recordset[0].FullName} has been deleted successfully` });
	} catch (error) {
		console.error('Something went wwrong', error);
		res.status(500).json({ message: 'Internal server Error' });
	}
}
export async function GetUserById(req, res) {
	try {
		const { id } = req.params;
		// console.log(`ddfrffffffffff ${id}`);

		const foundUser = await db.executeProcedure('GetUserById', { UserID: id });
		if (!foundUser) {
			res.status(404).json({ message: 'No user was found with that id' });
		}

		res.status(200).json(foundUser.recordset);
	} catch (error) {
		console.error('Something went wwrong', error);
		res.status(500).json({ message: 'Internal server Error' });
	}
}

export async function GetUserByEmail(req, res) {
	try {
		const { email } = req.params;

		const foundUser = await db.executeProcedure('GetUserByEmail', { Email: email });
		if (!foundUser) {
			res.status(404).json({ message: 'No user was found with that Email' });
		}
		console.log(foundUser);
		res.status(200).json(foundUser.recordset);
	} catch (error) {
		console.error('Something went wwrong', error);
		res.status(500).json({ message: 'Internal server Error' });
	}
}
