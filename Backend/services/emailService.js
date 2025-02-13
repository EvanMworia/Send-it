import nodemailer from 'nodemailer';

import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url'; //HELPER TO LOCATE OUR POSITION OF DB.JS

//GETTING OUR CURRENT LOCATION(of the file (in this case db.js))
const __filename = fileURLToPath(import.meta.url);
//GETTING THE LOCATION OF THE DIRECTORY WE ARE IN(config)
const __dirname = path.dirname(__filename);
//POINTING TO THE .ENV FILE SO WE CAN EXTRACT THE VARIABLES IIN THERE
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	// port: 587,
	// secure: false, // true for port 465, false for other ports
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

export async function sendWelcomeEmail(recipient, appUserName) {
	try {
		await transporter.sendMail({
			from: `SendIt Team <${process.env.EMAIL_USER}>`,
			to: `${recipient}`,
			subject: `Welcoome on Board`,
			html: `
                <h1>Welcome to SendIt, ${appUserName}!</h1>
                <p>We’re excited to have you on board. You can now send and track your parcels with ease.</p>
                <p>Get started now by logging in and creating your first parcel order.</p>
                <p>Best regards, <br/>SendIt Team</p>
            `,
		});
	} catch (error) {
		console.error('Error while sending email', error);
	}
}
export async function sendUpdateEmail(parcelId, status) {
	try {
		await transporter.sendMail({
			from: `SendIt Team <${process.env.EMAIL_USER}>`,
			to: `${recipient}`,
			subject: `Parcel Update`,
			html: `
                <h1>News on your parcel!</h1>
                <p>Thankyou for choosing SendIt </p>
                <p>Your parcel ${parcelId}, is now ${status}</p>
                <p>Best regards, <br/>SendIt Team</p>
            `,
		});
	} catch (error) {
		console.error('Error while sending email', error);
	}
}
