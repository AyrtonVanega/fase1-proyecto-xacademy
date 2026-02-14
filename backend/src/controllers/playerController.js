const playerService = require("../services/playerService");
const { sendXlsx } = require("../utils/exportXlsx");

/**
 * Devuelve todos los jugadores, filtrando por nombre si se especifica.
 */
const listPlayers = async (req, res) => {
  try {
    const {
      fifa_version,
      name,
      nationality,
      club,
      position,
    } = req.query;

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const filters = { fifa_version, name, nationality, club, position };
    const limit = 50;

    const result = await playerService.buscarTodos({
      filters,
      page,
      limit
    });

    res.json(result);
  } catch (err) {
    console.error("listPlayers error:", err);
    res.status(500).json({ error: "Error interno al obtener jugadores" });
  }
};

/**
 * Exporta los jugadores filtrados a un archivo XLSX.
 */
const exportPlayers = async (req, res) => {
  try {
    const { 
      fifa_version,
      name, 
      nationality, 
      club, 
      position 
    } = req.query;

    const filters = { fifa_version, name, nationality, club, position };

    const players = await playerService.exportarJugadores({ filters });

    // Enviar XLSX
    sendXlsx(res, players, "players.xlsx");
  } catch (error) {
    console.error("Error exportando jugadores:", error);
    res.status(500).json({ message: "Error exportando jugadores" });
  }
};

const getPlayerById = async (req, res) => {
  try {
    const { id } = req.params;
    const player = await playerService.buscarPorId(id);

    if (!player) {
      return res.status(404).json({ message: "Jugador no encontrado" });
    }

    res.json(player);
  } catch (err) {
    console.error("getPlayerById error:", err);
    res.status(500).json({ error: "Error interno al obtener jugador" });
  }
};

const updatePlayer = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const updated = await playerService.actualizarJugador(id, req.body);

    if (!updated) {
      return res.status(404).json({ message: "Jugador no encontrado" });
    }

    res.json(updated);

  } catch (err) {
    console.error("updatePlayer error:", err);
    res.status(500).json({ error: "Error interno al actualizar jugador" });
  }
};

const createPlayer = async (req, res) => {
  try {
    const newPlayer = await playerService.crearJugador(req.body);
    res.status(201).json(newPlayer);
  } catch (err) {
    console.error("createPlayer error:", err);
    res.status(500).json({ error: "Error interno al crear jugador" });
  }
};

module.exports = { listPlayers, exportPlayers, getPlayerById, updatePlayer, createPlayer };
