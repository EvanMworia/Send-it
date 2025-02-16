document.addEventListener('DOMContentLoaded', function () {
	const sendLink = document.getElementById('sendLink');
	const receiveLink = document.getElementById('receiveLink');
	const sendingDiv = document.getElementById('sending');
	const receivingDiv = document.getElementById('receiving');

	// Sample data for parcels
	const sendingParcels = ['Parcel A', 'Parcel B', 'Parcel C'];
	const receivingParcels = ['Parcel X', 'Parcel Y', 'Parcel Z'];

	const outgoingParcels = getOutgoingParcels();
	const incomingParcels = getIncomingParcels();
	// console.log('sendingParcels', sendingParcels);
	// console.log('receivingParcels', receivingParcels);

	// Function to load data into the lists
	function loadParcels(listId, parcels) {
		const list = document.getElementById(listId);
		list.innerHTML = ''; // Clear existing items
		parcels.forEach((parcel) => {
			const li = document.createElement('li');
			li.textContent = parcel;
			list.appendChild(li);
		});
	}

	// Load initial sending parcels
	loadParcels('sendingList', sendingParcels);

	// Handle tab switching
	sendLink.addEventListener('click', function () {
		sendingDiv.style.display = 'block';
		receivingDiv.style.display = 'none';
		sendLink.classList.add('active');
		receiveLink.classList.remove('active');

		loadParcels('sendingList', sendingParcels); // Load sending parcels
	});

	receiveLink.addEventListener('click', function () {
		sendingDiv.style.display = 'none';
		receivingDiv.style.display = 'block';
		receiveLink.classList.add('active');
		sendLink.classList.remove('active');

		loadParcels('receivingList', receivingParcels); // Load receiving parcels
	});
});

async function getOutgoingParcels() {
	console.log('get all parcels was called');
	try {
		let res = await fetch('http://localhost:5000/parcels/sending/96424ea8-f84e-4e09-91bf-5278e1247a06');

		let result = await res.json();
		// console.log('These are all the parcels we found ', result);
		return result;
	} catch (error) {
		console.error('The problem is ', error);
	}
}

async function getIncomingParcels() {
	console.log('get all parcels was called');
	try {
		let res = await fetch('http://localhost:5000/parcels/receiving/96424ea8-f84e-4e09-91bf-5278e1247a06');

		let result = await res.json();
		// console.log('These are all the parcels we found ', result);
		return result;
	} catch (error) {
		console.error('The problem is ', error);
	}
}

async function displayParcels() {
	const sendingParcels = await getOutgoingParcels();
	const receivingParcels = await getIncomingParcels();
	console.log('sendingParcels', sendingParcels);
	console.log('receivingParcels', receivingParcels);
}
