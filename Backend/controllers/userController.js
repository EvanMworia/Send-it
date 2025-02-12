import { DbHelper } from '../Database Helper/dbHelper.js';
import { registerUserSchema } from '../utils/validation.js';
const db = new DbHelper();

export async function registerNewUser(req, res) {
	try {
		//validate the request body against the defined schema
		const { error } = registerUserSchema.validate(req.body);
		//if any error in matters validation, stop execution and infor user of the error.
		if (error) {
			return res.status(400).json({ message: `${error.message}` });
		}

		//if validation is valid, extract the things we need from the body
		const { FullName, Email, PasswordHash, ProfilePicture, Phone, Role } = req.body;
		await db.executeProcedure('CreateNewUser', {
			FullName,
			Email,
			PasswordHash,
			ProfilePicture,
			Phone,
			Role,
		});
		res.status(201).json({
			message: `User ${FullName} has been created successfully`,
		});
	} catch (error) {
		console.error('Error happened ', error);
		res.status(500).json({ message: 'Server Error' });
	}
}
export async function getUsers(req, res) {
	try {
		let results = await db.executeProcedure('getUsers', {});
		console.log(results);
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
		console.log(`ddfrffffffffff ${id}`);

		const foundUser = await db.executeProcedure('GetUserById', { UserID: id });
		if (!foundUser) {
			res.status(404).json({ message: 'No user was found with that id' });
		}

		res.status(200).json({ message: `${foundUser.recordset[0].FullName} has been found` });
	} catch (error) {
		console.error('Something went wwrong', error);
		res.status(500).json({ message: 'Internal server Error' });
	}
}
