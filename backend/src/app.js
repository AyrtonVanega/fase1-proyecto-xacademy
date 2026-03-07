const express = require("express");
const PORT = process.env.PORT || 3000;

const cors = require("cors");
const db = require("./models");
const playerRoutes = require("./routes/playerRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Para recibir el csv como form-data
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/players", playerRoutes);

async function connectDB() {
  let connected = false;

  while (!connected) {
    try {
      await db.sequelize.authenticate();
      await db.sequelize.sync();
      console.log("✅ Conectado a MySQL");
      connected = true;
    } catch (error) {
      console.log("⏳ Esperando a MySQL...");
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
}

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en ${PORT}`);
  });
}

startServer();
