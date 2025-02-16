async function initMap() {
	try {
		const { Map } = await google.maps.importLibrary('maps');
		let map = new Map(document.getElementById('map'), {
			center: { lat: -34.397, lng: 150.644 },
			zoom: 8,
		});
	} catch (error) {
		console.error('Google Maps failed to load:', error);
	}
}

// async function initMap() {
// 	let mapTest = new google.maps.Map(document.getElementById('map'), {
// 		center: { lat: -34.397, lng: 150.644 },
// 		zoom: 8,
// 	});
// }
initMap();
