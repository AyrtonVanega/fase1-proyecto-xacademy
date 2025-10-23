const playerProvider = require("../providers/playerProvider");

async function buscarTodos(filters, page, limit, all = false) {
  try {
    const allPlayers = await playerProvider.findAll();

    // Filtrados
    const filtered = allPlayers.filter(p => {
      const matchFifa = filters.fifa_version
        ? p.fifa_version?.toLowerCase().includes(filters.fifa_version.toLowerCase())
        : true;
      const matchName = filters.name
        ? p.long_name?.toLowerCase().includes(filters.name.toLowerCase())
        : true;
      const matchNationality = filters.nationality
        ? p.nationality_name?.toLowerCase().includes(filters.nationality.toLowerCase())
        : true;
      const matchClub = filters.club
        ? p.club_name?.toLowerCase().includes(filters.club.toLowerCase())
        : true;
      const matchPosition = filters.position
        ? p.player_positions?.toLowerCase().includes(filters.position.toLowerCase())
        : true;

      return matchFifa && matchName && matchNationality && matchClub && matchPosition;
    });

    if (all) {
      return filtered;
    }
    
    // Paginación
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = filtered.slice(startIndex, endIndex);

    return {
      page,
      limit,
      total,
      totalPages,
      data,
    };
  } catch (err) {
    console.error("Error en PlayerService.buscarPaginado:", err);
    throw err;
  }
}

async function buscarPorId(id) {
  try {
    return await playerProvider.findById(id);
  } catch (err) {
    console.error("Error en PlayerService.buscarPorId:", err);
    throw err;
  }
}

/**
 * Asegura que los datos del jugador estén completos, 
 * válidos y en el formato correcto antes de guardarlos 
 * o actualizarlos en la base de datos.
 */
function sanitizePlayerData(data) {
  return {
    fifa_version: data.fifa_version || '',
    fifa_update: data.fifa_update || '',
    player_face_url: data.player_face_url || '',
    long_name: data.long_name || '',
    player_positions: data.player_positions || '',
    overall: data.overall ?? 0,
    potential: data.potential ?? 0,
    age: data.age ?? 0,
    club_name: data.club_name || null,
    nationality_name: data.nationality_name || null,
    value_eur: data.value_eur ?? 0,
    wage_eur: data.wage_eur ?? 0,
    height_cm: data.height_cm ?? 0,
    weight_kg: data.weight_kg ?? 0,
    preferred_foot: data.preferred_foot || null,
    weak_foot: data.weak_foot ?? 0,
    skill_moves: data.skill_moves ?? 0,
    international_reputation: data.international_reputation ?? 0,
    work_rate: data.work_rate || null,
    body_type: data.body_type || null,
    pace: data.pace ?? 0,
    shooting: data.shooting ?? 0,
    passing: data.passing ?? 0,
    dribbling: data.dribbling ?? 0,
    defending: data.defending ?? 0,
    physic: data.physic ?? 0,
    attacking_crossing: data.attacking_crossing ?? 0,
    attacking_finishing: data.attacking_finishing ?? 0,
    attacking_heading_accuracy: data.attacking_heading_accuracy ?? 0,
    attacking_short_passing: data.attacking_short_passing ?? 0,
    attacking_volleys: data.attacking_volleys ?? 0,
    skill_dribbling: data.skill_dribbling ?? 0,
    skill_curve: data.skill_curve ?? 0,
    skill_fk_accuracy: data.skill_fk_accuracy ?? 0,
    skill_long_passing: data.skill_long_passing ?? 0,
    skill_ball_control: data.skill_ball_control ?? 0,
    movement_acceleration: data.movement_acceleration ?? 0,
    movement_sprint_speed: data.movement_sprint_speed ?? 0,
    movement_agility: data.movement_agility ?? 0,
    movement_reactions: data.movement_reactions ?? 0,
    movement_balance: data.movement_balance ?? 0,
    power_shot_power: data.power_shot_power ?? 0,
    power_jumping: data.power_jumping ?? 0,
    power_stamina: data.power_stamina ?? 0,
    power_strength: data.power_strength ?? 0,
    power_long_shots: data.power_long_shots ?? 0,
    mentality_aggression: data.mentality_aggression ?? 0,
    mentality_interceptions: data.mentality_interceptions ?? 0,
    mentality_positioning: data.mentality_positioning ?? 0,
    mentality_vision: data.mentality_vision ?? 0,
    mentality_penalties: data.mentality_penalties ?? 0,
    mentality_composure: data.mentality_composure ?? 0,
    defending_marking: data.defending_marking ?? 0,
    defending_standing_tackle: data.defending_standing_tackle ?? 0,
    defending_sliding_tackle: data.defending_sliding_tackle ?? 0,
    goalkeeping_diving: data.goalkeeping_diving ?? 0,
    goalkeeping_handling: data.goalkeeping_handling ?? 0,
    goalkeeping_kicking: data.goalkeeping_kicking ?? 0,
    goalkeeping_positioning: data.goalkeeping_positioning ?? 0,
    goalkeeping_reflexes: data.goalkeeping_reflexes ?? 0,
    goalkeeping_speed: data.goalkeeping_speed ?? 0,
    player_traits: data.player_traits || '',
  };
}

async function actualizarJugador(id, data) {
  try {
    const sanitizedData = sanitizePlayerData(data);
    return await playerProvider.updateById(id, sanitizedData);
  } catch (err) {
    console.error("Error en PlayerService.actualizarJugador:", err);
    throw err;
  }
}

async function crearJugador(data) {
  try {
    const sanitizedData = sanitizePlayerData(data);
    return await playerProvider.createPlayer(sanitizedData);
  } catch (err) {
    console.error("Error en PlayerService.crearJugador:", err);
    throw err;
  }
}

module.exports = { buscarTodos, buscarPorId, actualizarJugador, crearJugador };
