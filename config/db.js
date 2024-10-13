// // /config/db.js
// // const mysql = require("mysql2");
// const mysql = require('mysql2');
// const dotenv = require("dotenv");

// dotenv.config();

// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
    
// });

// db.connect((err) => {
//     if (err) {
//         console.error("Error connecting to MySQL:", err);
//         process.exit(1);
//     }
//     console.log("Connected to MySQL");
// });

// module.exports = db;


// config/db.js
const mysql = require('mysql2/promise');
const dotenv = require("dotenv");

dotenv.config();

// Create the connection pool with promises enabled
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Check the connection
pool.getConnection()
    .then((connection) => {
        console.log("Connected to MySQL database successfully!");
        connection.release();
    })
    .catch((err) => {
        console.error("Error connecting to MySQL:", err);
        process.exit(1);
    });

module.exports = pool;
