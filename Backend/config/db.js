import mssql from 'mssql';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url'; //HELPER TO LOCATE OUR POSITION OF DB.JS

//GETTING OUR CURRENT LOCATION(of the file (in this case db.js))
const __filename = fileURLToPath(import.meta.url);
//GETTING THE LOCATION OF THE DIRECTORY WE ARE IN(config)
const __dirname = path.dirname(__filename);
//POINTING TO THE .ENV FILE SO WE CAN EXTRACT THE VARIABLES IIN THERE
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const sqlConfig = {
	user: process.env.DB_USER,
	password: process.env.DB_PWD,
	database: process.env.DB_NAME,
	server: process.env.SERVER_NAME,
	pool: {
		max: 10,
		min: 0,
		idleTimeoutMillis: 30000,
	},
	options: {
		encrypt: true, // for azure
		trustServerCertificate: true, // change to true for local dev / self-signed certs
	},
};

// HIVI NDIO UTAKUWA UNAEXECUTE HIZO PROCEDURES KWA CODE
//REMOVE THIS CODE HAPA AFTER FINDING WHERE YOU NEED TO USE IT AMA JUST COMMENT IT
//OFCOURSE FUNCTION NAME ITACHANGE

async function run() {
	let pool = await mssql.connect(sqlConfig);
	const result = await pool.query`select * from Users`;
	console.dir(result);
	// let users = (await pool.request().execute('A CERTAIN STORED PROCEDURE')).recordset;
	// let parcels = (await pool.request().execute('A CERTAIN STORED PROCEDURE')).recordset;
	// console.log(users);
	// console.log(parcels);
	console.log('The users we found are', result.recordset);
}

// run();
