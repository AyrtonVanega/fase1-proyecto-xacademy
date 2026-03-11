const db = require("../models");
const { Op } = require("sequelize");
const Player = db.Player;

async function findPaginated({ filters, page, limit }) {
  const where = buildWhere(filters);

  const offset = (page - 1) * limit;

  const { rows, count } = await Player.findAndCountAll({
    where,
    limit,
    offset,
    order: [["id", "ASC"]],
    raw: true // convierte instancias Sequelize a objetos planos
  });

  return {
    data: rows,
    total: count,
    totalPages: Math.ceil(count / limit),
    page,
    limit
  };
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
  const where = buildWhere(filters);

  const players = await Player.findAll({
    where,
    order: [["id", "ASC"]],
    raw: true
  });

  return players;
}

async function findById(id) {
  const player = await Player.findByPk(id);
  return player ? player.get({ plain: true }) : null;
}

async function updateById(id, data) {
  const player = await Player.findByPk(id);

  if (!player) return null;

  await player.update(data);

  return player.get({ plain: true });
}

async function createPlayer(data) {
  const newPlayer = await Player.create(data);
  return newPlayer.get({ plain: true });
}

async function findVersionsByPlayerIdentity(name, nationality, attributes) {
  return await Player.findAll({
    where: {
      long_name: name,
      nationality_name: nationality
    },
    attributes,
    order: [["fifa_version", "ASC"]],
    raw: true
  });
}

async function bulkInsert(players) {
  const chunkSize = 1000;

  for (let i = 0; i < players.length; i += chunkSize) {
    const chunk = players.slice(i, i + chunkSize);

    await Player.bulkCreate(chunk, {
      validate: true,
      ignoreDuplicates: true
    });

  }
}

async function count() {
  return await Player.count();
}

async function deletePlayer(id) {
  const deleted = await Player.destroy({
    where: { id: id }
  });

  return deleted; // cantidad de registros eliminados (0 o 1)
}

module.exports = {
  findPaginated,
  findAllFiltered,
  findById,
  updateById,
  createPlayer,
  findVersionsByPlayerIdentity,
  bulkInsert,
  count,
  deletePlayer
};
