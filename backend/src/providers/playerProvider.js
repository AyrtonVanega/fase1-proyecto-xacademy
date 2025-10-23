const db = require("../models");
const Player = db.Player;

async function findAll() {
  try {
    const players = await Player.findAll();
    return players.map(p => p.get({ plain: true })); // convierte instancias Sequelize a objetos planos
  } catch (err) {
    console.error("Error en PlayerProvider.findAll:", err);
    throw err;
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

module.exports = { findAll, findById, updateById, createPlayer };
