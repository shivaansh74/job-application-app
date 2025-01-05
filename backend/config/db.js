const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
});

const promisePool = pool.promise();

const setupDatabase = async () => {
    try {
        await promisePool.query('SELECT 1');
        console.log('Database connected successfully');

        setInterval(async () => {
            try {
                await promisePool.query('SELECT 1');
                console.log('Keep-alive ping successful:', new Date().toISOString());
            } catch (error) {
                console.error('Keep-alive ping failed:', error);
                setupDatabase();
            }
        }, 30000);
    } catch (error) {
        console.error('Database connection failed:', error);
        setTimeout(setupDatabase, 5000);
    }
};

setupDatabase();

module.exports = promisePool;