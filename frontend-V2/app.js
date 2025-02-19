// ===============================SIGN-UP PAGE HANDLER============================================================
// POST http://localhost:5000/users/registerUser
// Content-Type: application/json

// {
//     "FullName":"Sam",
//     "Email":"samwels036@gmail.com",
//     "Password":"Test@2024",
//     "ProfilePicture": "sbcbjs",
//     "Phone": "sncis",
//     "Role": "Admin"

// }
async function register() {
	try {
		let fullName = document.querySelector('#FullName').value;
		let email = document.querySelector('#email').value;
		let password = document.querySelector('#password').value;
		let profilePicture = document.querySelector('#ProfilePicture').value;
		let phone = document.querySelector('#Phone').value;
		let role = document.querySelector('#Role').value;

		data = {
			FullName: fullName,
			Email: email,
			Password: password,
			ProfilePicture: profilePicture,
			Phone: phone,
			Role: role,
		};
		let res = await fetch(`http://localhost:5000/users/registerUser`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		console.log(res);
		console.log(res.body);
		if (res.ok) {
			console.log('Regitsration was successful');
			console.log(res.body);
			window.location.href = './login.html';
		} else {
			throw new Error(`HTTP ERROR ${res.status}: ${res.statusText}`);
		}
	} catch (error) {
		console.error('What went wrong is : ', error);
	}
}
let registerBtn = document.querySelector('#register-btn');
registerBtn.addEventListener('click', (event) => {
	event.preventDefault();
	register();
});
// ===================================LOGIN PAGE HANDLER=====================================================
async function getUsers() {
	try {
		let response = await fetch('http://localhost:5000/users/getAllUsers');
		if (!response.ok) {
			throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
		}
		let users = await response.json();
		console.log(users);
		return users;
	} catch (error) {
		console.error('Error fetching users:', error);
		return []; // Default fallback value.
	}
}
let users = getUsers();
console.log('Users are', users);

async function login() {
	try {
		let email = document.querySelector('#email').value;
		let password = document.querySelector('#password').value;
		console.log('The email and password passed are', email, password);
		data = { Email: email, Password: password };
		let res = await fetch(`http://localhost:5000/users/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		const result = await res.json();
		console.log('The result we are storing is', result);

		if (res.ok) {
			localStorage.setItem('token', result.token);
			localStorage.setItem('USER', JSON.stringify(result.user));

			localStorage.setItem('isLoggedIn', 'true');
			console.log('Login was successful');
			console.log('the result user', result.user);
			console.log('the Entire result', result);
			console.log('the Entire result', result.user.Role);

			// window.location.href = './index.html';
			// let logoutBtn = document.querySelector('#log-out');
			// let authBtns = document.querySelectorAll('.btn-outline');
			// authBtns.forEach((btn) => {
			// 	btn.classList.add('hide');
			// });
			// logoutBtn.classList.remove('hide');
		} else {
			throw new Error(`HTTP ERROR ${res.status}: ${res.statusText}`);
		}
	} catch (error) {
		console.error('What went wrong is : ', error);
	}
}
//listen for the window load after login and hide unneccasrry buttons
window.onload = function () {
	let isLoggedIn = localStorage.getItem('isLoggedIn');
	let logoutBtn = document.querySelector('#log-out');
	let authBtns = document.querySelectorAll('.btn-outline');

	if (isLoggedIn === 'true') {
		authBtns.forEach((btn) => btn.classList.add('hide')); // Hide login/signup
		logoutBtn.classList.remove('hide'); // Show logout
	} else {
		authBtns.forEach((btn) => btn.classList.remove('hide')); // Show login/signup
		logoutBtn.classList.add('hide'); // Hide logout
	}
};

//mbona hii inakata kuwekwa event listener hapa, lakini kwa html inafanya
document.addEventListener('DOMContentLoaded', () => {
	let loginBtn = document.querySelector('#login-btn');
	loginBtn.addEventListener('click', (event) => {
		event.preventDefault();
		login();
	});
});

// ===================================LANDING PAGE HANDLER=====================================================
// ==================================HOME PAGE HANDLER========================================================
async function getUserById() {
	try {
		let res = await fetch(`http://localhost:5000/users/getUserById/e48b3296-6ca4-4c95-8f47-202c755369fd`);
		console.log(await res.json());
	} catch (error) {
		console.error('What went wrong is : ', error);
	}
}
getUserById();
// ===============================HISTORY PAGE HANDLER=======================================================
async function getAllParcels() {
	const token = localStorage.getItem('token'); // Retrieve token from storage
	if (!token) {
		alert('User not authenticated');
		return;
	}
	console.log('get all parcels was called');
	try {
		let res = await fetch('http://localhost:5000/parcels');
		console.log(res);
		let result = await res.json();
		// console.log('These are all the parcels we found ', result);
		return result;
	} catch (error) {
		console.error('The problem is ', error);
	}
}
getAllParcels();
let parcelCard = document.querySelector('.parcel-card');
async function displayHistoryOfParcels() {
	let response = await getAllParcels();
	let parcels = response.data;
	console.log(parcels);
	parcelCard.innerHTML = '';
	parcels.forEach((parcel) => {
		parcelCard.innerHTML += `<div class="parcel-id">ID: ${parcel.ParcelID}</div>
				<div class="locations">${parcel.SendingLocation} → ${parcel.PickupLocation}</div>
				<div class="status">${parcel.Status}</div>
				<div class="date">${parcel.CreatedAt}</div>
                <br>`;
	});
}
displayHistoryOfParcels();

// ===============================SEND PAGE HANDLER=====================================================
