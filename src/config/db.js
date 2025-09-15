const { Sequelize } = require("sequelize");


const sequelize = new Sequelize("doctors_collab", "postgres", "Varada@2003", {
  host: "localhost",
  dialect: "postgres",
  port: 5432,
  logging: false, // set true if you want to see raw SQL logs
});

module.exports = sequelize;
