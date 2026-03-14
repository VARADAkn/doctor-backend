module.exports = {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "Nikhil",
  PASSWORD: process.env.DB_PASSWORD || "Nanthida@2003",
  DB: process.env.DB_NAME || "doctors",
  dialect: process.env.DB_DIALECT || "postgres"
};