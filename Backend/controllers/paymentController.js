import { Stripe } from 'stripe';

import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

//GETTING OUR CURRENT LOCATION(of the file (in this case db.js))
const __filename = fileURLToPath(import.meta.url);
//GETTING THE LOCATION OF THE DIRECTORY WE ARE IN(config)
const __dirname = path.dirname(__filename);
//POINTING TO THE .ENV FILE SO WE CAN EXTRACT THE VARIABLES IIN THERE
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const stripe = Stripe(process.env.ST_SKEY);

export async function createCheckoutSession(req, res) {
	try {
		const { amount } = req.body;

		if (!amount || isNaN(amount)) {
			return res.status(400).json({ error: 'Amount must be a valid number' });
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price_data: {
						currency: 'usd',
						product_data: {
							name: 'Parcel Delivery Fee',
						},
						unit_amount: parseInt(amount, 10), // Amount in cents, must be an integer
					},
					quantity: 1,
				},
			],
			mode: 'payment',
			success_url: 'http://127.0.0.1:5500/frontend-V2/stripe-success.html',
			cancel_url: 'http://127.0.0.1:5500/frontend-V2/stripe-cancel.html',
		});

		console.log('Stripe session URL:', session.url); // Debugging log
		res.json({ url: session.url }); // Ensure you're sending the URL
	} catch (error) {
		console.error('Error creating payment intent:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
}

//==================================================
//================== WHAT WE ARE DOING.=============
//===================================================
// USING THE STRIPE SECRET KEY TO CREATE AN INSTANC EOF STRIPE OBJECT
//WE USE THIS OBJECT TO CREATE A PAYMENT INTENT
//WHEN WE CREATE THE PAYMENT INTENT WE SPECIFY THINGS LIKE AMOUNT, CURRENCY, PAYMENT METHODS ACCEPTED
// THE PAYMENT INTENT HELPS/ ALLOWS US TO TRACK THE PURCHASE FUNNEL - IF THE AMOUNT CHANGES WE CAN UPDATE IT
//IF A PAYMENT INTENT IS INTERRUPTED  AND THE USER RETRIES AGAIN, WE CAN REUSE THE SAME P.I SINCE IT HAS A UNIQUE ID WE CAN USE TO RETRIEVE IT

//YOU CAN CHOOSE TO STORE THE PAYMENT INTENT ON THE USERS CART OR THE SESSION TO FACILITATE RETRIVAL

//THE P.I CONTAINS A CLIENT SECRET - A KEY THAT IS UNIQUE TO THE INDIVIDUAL P.I - WHICH CAN BE USED TO COMPLETE PAYMENTS
// export async function createPaymentIntent(req, res) {
// 	try {
// 		//extract payment details from the request body
// 		const { amount, currency } = req.body;

// 		const paymentIntent = await stripe.paymentIntents.create({
// 			amount: amount * 100,
// 			currency: 'usd',
// 			// currency: currency,
// 			payment_method_types: ['card'],
// 		});
// 		res.json({ client_secret: paymentIntent.client_secret });
// 	} catch (error) {
// 		console.error('Error creating payment intent:', error);
// 		res.status(500).json({ error: error.message });
// 	}
// }
