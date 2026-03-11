const express = require("express");
const router = express.Router();
const playerController = require("../controllers/playerController");
const { authMiddleware, uploadMiddleware } = require("../middleware");

// Todas las rutas debajo de esto requieren token
router.use(authMiddleware);

// Listado + filtros
router.get("/", playerController.listPlayers);

// Export del listado filtrado a XLSX
router.get("/export", playerController.exportPlayers);

// Import CSV
router.post(
    "/import",
    uploadMiddleware.single("file"),
    playerController.importPlayers
);

// Timeline de habilidades
router.get("/:id/skills/timeline", playerController.getSkillTimeline);

// Obtener jugador por ID
router.get("/:id", playerController.getPlayerById);

// Actualizar jugador
router.put("/:id", playerController.updatePlayer);

// Eliminar jugador
router.delete("/:id", playerController.deletePlayer);

// Crear nuevo jugador
router.post("/", playerController.createPlayer);

module.exports = router;
