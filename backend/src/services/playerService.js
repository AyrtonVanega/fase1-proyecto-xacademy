const playerProvider = require("../providers/playerProvider");
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

  if (rawRows.length === 0) {
    throw new Error("El archivo CSV está vacío");
  }

  // Mapeo de datos
  const players = rawRows.map((row) => {
    return {
      fifa_version: row.fifa_version,
      fifa_update: row.fifa_update,
      player_face_url: row.player_face_url,
      long_name: row.long_name,
      player_positions: row.player_positions,
      club_name: row.club_name,
      nationality_name: row.nationality_name,
      overall: parseInt(row.overall),
      potential: parseInt(row.potential),
      value_eur: parseInt(row.value_eur) || null,
      wage_eur: parseInt(row.wage_eur) || null,
      age: parseInt(row.age),
      height_cm: parseInt(row.height_cm) || null,
      weight_kg: parseInt(row.weight_kg) || null,
      preferred_foot: row.preferred_foot,
      weak_foot: parseInt(row.weak_foot) || null,
      skill_moves: parseInt(row.skill_moves) || null,
      international_reputation: parseInt(row.international_reputation) || null,
      work_rate: row.work_rate,
      body_type: row.body_type,
      pace: parseInt(row.pace) || null,
      shooting: parseInt(row.shooting) || null,
      passing: parseInt(row.passing) || null,
      dribbling: parseInt(row.dribbling) || null,
      defending: parseInt(row.defending) || null,
      physic: parseInt(row.physic) || null,
      player_traits: row.player_traits
    };
  });

  const inserted = await playerProvider.bulkInsert(players);

  return {
    message: "Importación completada",
    totalRows: rawRows.length,
    inserted
  };
}

module.exports = { buscarTodos, exportarJugadores, buscarPorId, actualizarJugador, crearJugador, obtenerTimelineHabilidades, importarJugadores };
