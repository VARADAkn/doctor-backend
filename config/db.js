require('dotenv').config();

module.exports = {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "postgres",
  PASSWORD: process.env.DB_PASSWORD || "Varada@2003",
  DB: process.env.DB_NAME || "doctor",
  dialect: process.env.DB_DIALECT || "postgres"
};