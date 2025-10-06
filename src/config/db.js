const { Sequelize } = require("sequelize");

// This line loads the variables from your .env file into process.env
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    logging: false, // set true if you want to see raw SQL logs
  }
);

module.exports = sequelize;

