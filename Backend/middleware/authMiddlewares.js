import jwt from 'jsonwebtoken';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url'; //HELPER TO LOCATE OUR POSITION OF DB.JS

//GETTING OUR CURRENT LOCATION(of the file (in this case db.js))
const __filename = fileURLToPath(import.meta.url);
//GETTING THE LOCATION OF THE DIRECTORY WE ARE IN(config)
const __dirname = path.dirname(__filename);
//POINTING TO THE .ENV FILE SO WE CAN EXTRACT THE VARIABLES IIN THERE
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export function authenticateJWT(req, res, next) {
	const token = req.header('Authorization');

	if (!token) {
		return res.status(401).json({ message: 'Access Denied. No token provided.' });
	}

	try {
		const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);

		req.user = decoded; // Attach user data to the request
		next();
	} catch (error) {
		res.status(401).json({ message: 'Invalid Token' });
	}
}


