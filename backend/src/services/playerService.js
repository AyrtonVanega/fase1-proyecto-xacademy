const playerProvider = require("../providers/playerProvider");

async function buscarTodos({ filters, page, limit }) {
  return await playerProvider.findPaginated({ filters, page, limit });
}

async function exportarJugadores({ filters }) {
  return await playerProvider.findAllFiltered({ filters });
}

async function buscarPorId(id) {
  try {
    return await playerProvider.findById(id);
  } catch (err) {
    console.error("Error en PlayerService.buscarPorId:", err);
    throw err;
  }
}

async function actualizarJugador(id, data) {
  return await playerProvider.updateById(id, data);
}

async function crearJugador(data) {
  return await playerProvider.createPlayer(data);
}

async function obtenerTimelineHabilidades(id, skills) {
  const basePlayer = await playerProvider.findById(id);
  if (!basePlayer) return null;

  return await playerProvider.findVersionsByPlayerIdentity(
    basePlayer.long_name,
    basePlayer.nationality_name,
    ["fifa_version", ...skills]
  );
}

module.exports = { buscarTodos, exportarJugadores, buscarPorId, actualizarJugador, crearJugador, obtenerTimelineHabilidades };
