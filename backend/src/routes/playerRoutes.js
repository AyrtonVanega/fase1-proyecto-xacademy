const express = require("express");
const router = express.Router();
const playerController = require("../controllers/playerController");
const { authMiddleware } = require("../middleware");

// Todas las rutas debajo de esto requieren token
router.use(authMiddleware);

// Listado + filtros
router.get("/", playerController.listPlayers);

// Export del listado filtrado a XLSX
router.get("/export", playerController.exportPlayers);

// Timeline de habilidades
router.get("/:id/skills/timeline", playerController.getSkillTimeline);

// Obtener jugador por ID
router.get("/:id", playerController.getPlayerById);

// Actualizar jugador
router.put("/:id", playerController.updatePlayer);

// Crear nuevo jugador
router.post("/", playerController.createPlayer);

module.exports = router;
