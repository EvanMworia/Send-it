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

//New Parcel Notification
export async function notifyParcelRecepient(parcelSender, parcelReceipient, parcelId, pickupLocation) {
	try {
		await transporter.sendMail({
			from: `SendIt Team <${process.env.EMAIL_USER}>`,
			to: `<${parcelReceipient}>`,
			subject: `NEW PARCEL ALERT`,
			html: `
                <h1>Parcel Comming your way.</h1>
                <p>${parcelSender} has sent you a parcel <b> ${parcelId} </b>, the destination/pickup point is ${pickupLocation}</p>
				<p>We will notify you once your parcel arrives</p>
				<br/>
				<p><b>NOTE: </b>Keep the tracking number <b> ${parcelId} </b> PRIVATE since we will need you to provide it when you collect your parcel.</p>
				<p>Thankyou for choosing SendIt</p>
				<br/>
				<br/>
                
                <p>Best regards, <br/>SendIt Team</p>
            `,
		});
	} catch (error) {
		console.error('Error while sending email', error);
	}
}

export async function notifyParcelSender(parcelSender, parcelReceipient, parcelId, pickupLocation) {
	try {
		await transporter.sendMail({
			from: `SendIt Team <${process.env.EMAIL_USER}>`,
			to: `<${parcelSender}>`,
			subject: `PARCEL ALERT`,
			html: `
                <h1>Outgoing Parcel Confirmed</h1>
                <p><b> ${parcelId} </b> has been sent to ${parcelReceipient}, the destination/pickup point is ${pickupLocation}</p>
				<p>We will notify you once your parcel arrives</p>
				<br/>
				
				<p>Thankyou for choosing SendIt</p>
				<br/>
				<br/>
                <p>Best regards, <br/>SendIt Team</p>
            `,
		});
	} catch (error) {
		console.error('Error while sending email', error);
	}
}
export async function sendUpdateEmail(parcelSender, parcelReceipient, parcelId, status) {
	try {
		await transporter.sendMail({
			from: `SendIt Team <${process.env.EMAIL_USER}>`,
			to: `<${parcelReceipient}>, <${parcelSender}>`,
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
