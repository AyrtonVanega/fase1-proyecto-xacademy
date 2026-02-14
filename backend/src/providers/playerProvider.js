const db = require("../models");
const { Op } = require("sequelize");
const Player = db.Player;

async function findPaginated({ filters, page, limit }) {
  try {
    const where = buildWhere(filters);

    const offset = (page - 1) * limit;

    const { rows, count } = await Player.findAndCountAll({
      where,
      limit,
      offset,
      order: [["overall", "DESC"]],
      raw: true // convierte instancias Sequelize a objetos planos
    });

    return {
      data: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      page,
      limit
    };

  } catch (err) {
    console.error("Error en PlayerProvider.findPaginated:", err);
    throw err;
  }
}

function buildWhere(filters) {
  const where = {};

  if (filters.fifa_version) {
    where.fifa_version = { [Op.like]: `%${filters.fifa_version}%` };
  }

  if (filters.name) {
    where.long_name = { [Op.like]: `%${filters.name}%` };
  }

  if (filters.nationality) {
    where.nationality_name = { [Op.like]: `%${filters.nationality}%` };
  }

  if (filters.club) {
    where.club_name = { [Op.like]: `%${filters.club}%` };
  }

  if (filters.position) {
    where.player_positions = { [Op.like]: `%${filters.position}%` };
  }

  return where;
}

async function findAllFiltered({ filters }) {
  try {
    const where = buildWhere(filters);

    const players = await Player.findAll({
      where,
      order: [["overall", "DESC"]],
      raw: true
    });

    return players;
  } catch (error) {
    console.error("Error en PlayerProvider.findAllFiltered:", error);
    throw error;
  }

}

async function findById(id) {
  try {
    const player = await Player.findByPk(id);
    return player ? player.get({ plain: true }) : null;
  } catch (err) {
    console.error("Error en PlayerProvider.findById:", err);
    throw err;
  }
}

async function updateById(id, data) {
  try {
    const [rowsUpdated] = await Player.update(data, {
      where: { id },
    });

    if (rowsUpdated === 0) {
      return null; // no se encontró el jugador
    }

    const updatedPlayer = await Player.findByPk(id);
    return updatedPlayer.get({ plain: true });
  } catch (err) {
    console.error("Error en PlayerProvider.updateById:", err);
    throw err;
  }
}

async function createPlayer(data) {
  try {
    const newPlayer = await Player.create(data);
    return newPlayer.get({ plain: true });
  } catch (err) {
    console.error("Error en PlayerProvider.createPlayer:", err);
    throw err;
  }
}

module.exports = { findPaginated, findAllFiltered, findById, updateById, createPlayer };
