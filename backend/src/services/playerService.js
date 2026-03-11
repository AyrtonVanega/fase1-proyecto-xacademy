const playerProvider = require("../providers/playerProvider");
const playerMapper = require("../mappers/playerMapper");
const csv = require("csv-parser");
const { Readable } = require("stream");

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

async function importarJugadores(buffer) {
  const rawRows = [];

  const stream = Readable.from(buffer);

  await new Promise((resolve, reject) => {
    stream
      .pipe(csv())
      .on("data", (row) => rawRows.push(row))
      .on("end", resolve)
      .on("error", reject);
  });

  if (!rawRows.length) {
    throw new Error("El archivo CSV está vacío");
  }

  // Mapeo de datos
  const players = rawRows.map(playerMapper.fromCsvRow);

  const before = await playerProvider.count();
  await playerProvider.bulkInsert(players);
  const after = await playerProvider.count();

  const inserted = after - before;

  return {
    totalRows: rawRows.length,
    inserted,
    duplicates: rawRows.length - inserted
  };
}

async function eliminarJugador(id) {
  try {
    return await playerProvider.deletePlayer(id);
  } catch (err) {
    console.error("Error en PlayerService.eliminarJugador:", err);
    throw err;
  }
}

module.exports = {
  buscarTodos,
  exportarJugadores,
  buscarPorId,
  actualizarJugador,
  crearJugador,
  obtenerTimelineHabilidades,
  importarJugadores,
  eliminarJugador
};
