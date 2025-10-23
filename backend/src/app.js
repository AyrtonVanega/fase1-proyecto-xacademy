const express = require("express");
const PORT = process.env.PORT || 3000;

const cors = require("cors");
const db = require("./models/index.js");
const playerRoutes = require("./routes/playerRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/players", playerRoutes);

// Test conexión DB al arrancar
db.sequelize.authenticate()
  .then(() => console.log("✅ Conectado a la DB"))
  .catch(err => console.error("❌ Error DB:", err));

app.listen(PORT, () => console.log(`Servidor escuchando en ${PORT}`));
