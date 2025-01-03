const sql = require("mssql");

const config = {
  user: "sa",
  password: "test",
  server: "AZMEER",
  database: "KSVJ",
  options: {
    trustServerCertificate: true,
    trustedConnection: false,
    enableArithAbort: true,
    encrypt: false,
  },
  port: 1433,
};
let pool;

const connectToDB = async () => {
  if (!pool) {
    try {
      pool = await sql.connect(config);
      console.log("Database connected successfully.");
    } catch (error) {
      console.error("Database connection failed:", error);
      throw error;
    }
  }
  return pool;
};

const closeConnection = async () => {
  if (pool) {
    try {
      await pool.close();
      pool = null;
      console.log("Database connection closed.");
    } catch (error) {
      console.error("Failed to close the database connection:", error);
    }
  }
};

module.exports = { connectToDB, closeConnection, config };
