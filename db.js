var mariadb = require('mariadb');

// Create a connection pool
var pool = mariadb.createPool({
  host: '0.0.0.0', 
  port: 3306,
  user: 'raspi', 
  password: 'raspi',
  database: 'projet_eolienne'
});

// Function to establish a connection
async function connectDB() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("Connected to MariaDB!");
  } catch (err) {
    console.error("Not connected due to error: " + err);
  }
  return conn;
}

// Export the pool and connectDB function
module.exports = Object.freeze({
  pool: pool,
  connectDB: connectDB
});