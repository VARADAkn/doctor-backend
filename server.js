const express = require("express");
const { sequelize } = require("./src/models");
const routes = require("./src/routes");

const app = express();
app.use(express.json());

// Routes
app.use("/api", routes);

app.get("/", (_req, res) => res.json({ message: "API is running" }));

const PORT = 4000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    // Debug log: check loaded models
    console.log("Loaded models:", Object.keys(sequelize.models));

    await sequelize.sync({ alter: true });
    console.log("✅ Models synced");

    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ DB Error:", err);
  }
})();

