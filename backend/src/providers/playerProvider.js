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
  const player = await Player.findByPk(id);

  if (!player) return null;

  await player.update(data);

  return player.get({ plain: true });
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

async function findVersionsByPlayerIdentity(name, nationality, attributes) {
  try {
    return await Player.findAll({
      where: {
        long_name: name,
        nationality_name: nationality
      },
      attributes,
      order: [["fifa_version", "ASC"]],
      raw: true
    });
  } catch (err) {
    console.error("Error en PlayerProvider.findVersionsByPlayerIdentity:", err);
    throw err;
  }
}

async function bulkInsert(players) {
  try {
    const chunkSize = 1000;
    let totalInserted = 0;

    for (let i = 0; i < players.length; i += chunkSize) {
      const chunk = players.slice(i, i + chunkSize);

      const result = await Player.bulkCreate(chunk, {
        validate: true,
        ignoreDuplicates: true
      });

      totalInserted += result.length;
    }

    return totalInserted;
  } catch (err) {
    console.error("Error en PlayerProvider.bulkInsert:", err);
    throw err;
  }
}

module.exports = { findPaginated, findAllFiltered, findById, updateById, createPlayer, findVersionsByPlayerIdentity, bulkInsert };
