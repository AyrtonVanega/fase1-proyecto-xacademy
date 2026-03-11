const playerService = require("../services/playerService");
const { sendXlsx } = require("../utils/exportXlsx");
const SkillTimelineDTO = require("../dtos/skillTimeLineDto");

/**
 * Devuelve todos los jugadores, filtrando por nombre si se especifica.
 */
const listPlayers = async (req, res, next) => {
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

  try {
    const result = await playerService.buscarTodos({
      filters,
      page,
      limit
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Exporta los jugadores filtrados a un archivo XLSX.
 */
const exportPlayers = async (req, res, next) => {
  const {
    fifa_version,
    name,
    nationality,
    club,
    position
  } = req.query;

  const filters = { fifa_version, name, nationality, club, position };

  try {
    const players = await playerService.exportarJugadores({ filters });

    // Enviar XLSX
    sendXlsx(res, players, "players.xlsx");
  } catch (error) {
    next(error);
  }
};

const getPlayerById = async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const player = await playerService.buscarPorId(id);

    if (!player) {
      return res.status(404).json({ message: "Jugador no encontrado" });
    }

    res.json(player);
  } catch (error) {
    next(error);
  }
};

const updatePlayer = async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const updated = await playerService.actualizarJugador(id, req.body);

    if (!updated) {
      return res.status(404).json({ message: "Jugador no encontrado" });
    }

    res.json(updated);

  } catch (error) {
    next(error);
  }
};

const createPlayer = async (req, res, next) => {
  try {
    const newPlayer = await playerService.crearJugador(req.body);
    res.status(201).json(newPlayer);
  } catch (error) {
    next(error);
  }
};

const getSkillTimeline = async (req, res, next) => {
  const { id } = req.params;
  const { skills } = req.query;

  if (!skills) {
    return res.status(400).json({
      message: "Query param 'skills' is required"
    });
  }

  const skillsArray = skills.split(",");

  try {
    const records = await playerService.obtenerTimelineHabilidades(
      id,
      skillsArray
    );

    if (!records) {
      return res.status(404).json({
        message: "Player not found"
      });
    }

    const response = SkillTimelineDTO.build(id, records, skillsArray);

    res.json(response);

  } catch (error) {
    next(error);
  }
};

const importPlayers = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const result = await playerService.importarJugadores(req.file.buffer);

    return res.status(201).json(result);

  } catch (error) {
    next(error);
  }
};

const deletePlayer = async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const deleted = await playerService.eliminarJugador(id);

    if (!deleted) {
      return res.status(404).json({ message: "Jugador no encontrado" });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listPlayers,
  exportPlayers,
  getPlayerById,
  updatePlayer,
  createPlayer,
  getSkillTimeline,
  importPlayers,
  deletePlayer
};
