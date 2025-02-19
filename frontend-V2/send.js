async function sendParcel() {
	try {
		let senderEmail = document.querySelector('#senderEmail').value;
		let receiverEmail = document.querySelector('#receiverEmail').value;
		let sendingLocation = document.querySelector('#sendingLocation').value;
		let pickupLocation = document.querySelector('#pickupLocation').value;

		data = {
			senderEmail: senderEmail,
			receiverEmail: receiverEmail,
			sendingLocation: sendingLocation,
			pickupLocation: pickupLocation,
		};
		let res = await fetch(`http://localhost:5000/parcels`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		console.log(res);
		console.log(res.body);
		if (res.ok) {
			console.log('Parcel creation was successful');
			console.log(res.body);
		} else {
			throw new Error(`HTTP ERROR ${res.status}: ${res.statusText}`);
		}
	} catch (error) {
		console.error('What went wrong is : ', error);
	}
}
document.querySelector('#create-parcel').addEventListener('click', (event) => {
	event.preventDefault();
	sendParcel();
});
