// Import Stripe from its CDN
const stripe = Stripe(
	'pk_test_51OfjeGLmYo3j1HU90DSxlWd3WvwZFUMFlSjY1KKCXlNRGTKNycZTN8SaWzTeE5VLbHaS2vCRS9XQf11UoY7rDY2v00DSfhpo9r'
); // Replace with your actual publishable key

// Create an instance of Stripe Elements, which manages UI components for card input
const elements = stripe.elements();

// Create a Card Element and mount it to the #card-element div
const cardElement = elements.create('card');

// This will render the Stripe card input field in the UI
cardElement.mount('#card-element');

// Select the necessary DOM elements
const form = document.getElementById('payment-form');
const messageDiv = document.getElementById('payment-message');

// Listen for form submission
form.addEventListener('submit', async (event) => {
	event.preventDefault(); // Prevent the form from submitting the traditional way

	let senderEmail = document.querySelector('#senderEmail').value;
	let receiverEmail = document.querySelector('#receiverEmail').value;
	let sendingLocation = document.querySelector('#sendingLocation').value;
	let pickupLocation = document.querySelector('#pickupLocation').value;

	let data = {
		senderEmail: senderEmail,
		receiverEmail: receiverEmail,
		sendingLocation: sendingLocation,
		pickupLocation: pickupLocation,
	};

	if (!data) {
		messageDiv.textContent = 'Please enter parcel details.';
		return;
	}

	try {
		// 1️⃣ Request a Payment Intent from the Backend
		const response = await fetch('http://localhost:5000/payment/create-payment-intent', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ amount: 10, currency: 'usd' }), // Example: 10 USD
		});

		const { clientSecret } = await response.json();

		// 2️⃣ Confirm Payment using the retrieved Client Secret
		const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
			payment_method: { card: cardElement },
		});

		if (error) {
			// Handle any errors during the payment process
			messageDiv.textContent = `Payment failed: ${error.message}`;
		} else if (paymentIntent.status === 'succeeded') {
			// Payment was successful! Now we schedule the parcel for delivery

			messageDiv.textContent = 'Payment successful! Your parcel is now scheduled for delivery.';

			// 3️⃣ Call Backend to Mark Parcel as Created
			await fetch('http://localhost:5000/parcels', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ parcelDetails }),
			});
		}
	} catch (err) {
		console.error('Error processing payment:', err);
		messageDiv.textContent = 'Something went wrong. Please try again.';
	}
});
