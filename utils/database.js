const sql = require("mssql");

const config = {
  user: "sa",
  password: "test", 
  server: "DESKTOP-TQFVMDC",
  database: "KSVJ",
  port: 1433,
  connectionTimeout: 60000, // 60 seconds timeout for connections
  requestTimeout: 60000, // 60 seconds timeout for requests
  options: {
    trustServerCertificate: true,
    trustedConnection: false, // this is usually for Windows Auth; may not be needed here
    enableArithAbort: true,
    encrypt: false,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 60000, // 60 seconds
    createTimeoutMillis: 60000, // 60 seconds
    destroyTimeoutMillis: 5000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 200,
  },
};

let pool;

const connectToDB = async () => {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log("Database connected successfully.");
    } else if (pool.closed) {
      pool = await sql.connect(config);
      console.log("Database reconnected successfully.");
    }
    return pool;
  } catch (error) {
    console.log("Database connection failed:", error);
    // Reset pool on error
    pool = null;
    throw error;
  }
};

const closeConnection = async () => {
  if (pool && !pool.closed) {
    try {
      await pool.close();
      pool = null;
      console.log("Database connection closed.");
    } catch (error) {
      console.log("Failed to close the database connection:", error);
    }
  }
};

module.exports = { connectToDB, closeConnection, config };
