// const AfricasTalking = require('africastalking');
import AfricasTalking from 'africastalking';
import express from 'express';
//READ THE ENVIRONMENT VARIABLES
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url'; //HELPER TO LOCATE OUR POSITION OF DB.JS

//GETTING OUR CURRENT LOCATION(of the file (in this case db.js))
const __filename = fileURLToPath(import.meta.url);
//GETTING THE LOCATION OF THE DIRECTORY WE ARE IN(config)
const __dirname = path.dirname(__filename);
//POINTING TO THE .ENV FILE SO WE CAN EXTRACT THE VARIABLES IIN THERE

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// TODO: Initialize Africa's Talking
const africastalking = AfricasTalking({
	apiKey: process.env.AT_KEY,
	username: process.env.AT_USERNAME,
});

export async function sendSMS() {
	// TODO: Send message
	try {
		const result = await africastalking.SMS.send({
			// to: process.env.AT_RECEIVER,
			to: ['+254751335348'],
			message: 'Hello DEVANS',
		});
		console.log(result);
	} catch (ex) {
		console.error(ex);
	}
}
export async function sendWelcomeSMS(receipientPhone, appUserName) {
	// TODO: Send message
	try {
		const result = await africastalking.SMS.send({
			// to: process.env.AT_RECEIVER,
			to: [`${receipientPhone}`],
			message: `Hello ${appUserName}, Welcome to SendIt.! 
				We’re excited to have you on board. You can now send and track your parcels with ease.
				Get started now by logging in and creating your first parcel order.
				Best regards, SendIt Team`,
		});
		console.log(result);
	} catch (ex) {
		console.error(ex);
	}
}
export async function sendSMSToRecepient(parcelSender, parcelReceipientPhone, parcelId, pickupLocation) {
	// TODO: Send message
	try {
		const result = await africastalking.SMS.send({
			// to: process.env.AT_RECEIVER,
			to: [`${parcelReceipientPhone}`],
			message: `Parcel Comming your way.
				${parcelSender} has sent you a parcel, with id: ${parcelId}, the pickup point is ${pickupLocation}. We will notify you once your parcel arrives
				NOTE: Keep the tracking number/id PRIVATE since we will need you to provide it when you collect your parcel.
				Thankyou for choosing SendIt
				Best regards.`,
		});
		console.log(result);
	} catch (ex) {
		console.error(ex);
	}
}
async function smsServer() {
	const app = express();

	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));

	// TODO: Incoming messages route

	// TODO: Delivery reports route

	const port = process.env.PORT || 8000;

	app.listen(port, () => {
		console.log(`App running on port: ${port}`);

		// TODO: call sendSMS to send message after server starts
		// sendSMS();
	});
}

smsServer();
