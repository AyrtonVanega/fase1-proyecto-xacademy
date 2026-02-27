const toInt = (value) => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? null : parsed;
};

exports.fromCsvRow = (row) => ({
    fifa_version: row.fifa_version,
    fifa_update: row.fifa_update,
    player_face_url: row.player_face_url,
    long_name: row.long_name,
    player_positions: row.player_positions,
    club_name: row.club_name || null,
    nationality_name: row.nationality_name || null,

    overall: toInt(row.overall),
    potential: toInt(row.potential),

    value_eur: toInt(row.value_eur),
    wage_eur: toInt(row.wage_eur),

    age: toInt(row.age),
    height_cm: toInt(row.height_cm),
    weight_kg: toInt(row.weight_kg),

    preferred_foot: row.preferred_foot || null,
    weak_foot: toInt(row.weak_foot),
    skill_moves: toInt(row.skill_moves),
    international_reputation: toInt(row.international_reputation),

    work_rate: row.work_rate || null,
    body_type: row.body_type || null,

    // Ratings principales
    pace: toInt(row.pace),
    shooting: toInt(row.shooting),
    passing: toInt(row.passing),
    dribbling: toInt(row.dribbling),
    defending: toInt(row.defending),
    physic: toInt(row.physic),

    // Attacking
    attacking_crossing: toInt(row.attacking_crossing),
    attacking_finishing: toInt(row.attacking_finishing),
    attacking_heading_accuracy: toInt(row.attacking_heading_accuracy),
    attacking_short_passing: toInt(row.attacking_short_passing),
    attacking_volleys: toInt(row.attacking_volleys),

    // Skill
    skill_dribbling: toInt(row.skill_dribbling),
    skill_curve: toInt(row.skill_curve),
    skill_fk_accuracy: toInt(row.skill_fk_accuracy),
    skill_long_passing: toInt(row.skill_long_passing),
    skill_ball_control: toInt(row.skill_ball_control),

    // Movement
    movement_acceleration: toInt(row.movement_acceleration),
    movement_sprint_speed: toInt(row.movement_sprint_speed),
    movement_agility: toInt(row.movement_agility),
    movement_reactions: toInt(row.movement_reactions),
    movement_balance: toInt(row.movement_balance),

    // Power
    power_shot_power: toInt(row.power_shot_power),
    power_jumping: toInt(row.power_jumping),
    power_stamina: toInt(row.power_stamina),
    power_strength: toInt(row.power_strength),
    power_long_shots: toInt(row.power_long_shots),

    // Mentality
    mentality_aggression: toInt(row.mentality_aggression),
    mentality_interceptions: toInt(row.mentality_interceptions),
    mentality_positioning: toInt(row.mentality_positioning),
    mentality_vision: toInt(row.mentality_vision),
    mentality_penalties: toInt(row.mentality_penalties),
    mentality_composure: toInt(row.mentality_composure),

    // Defending
    defending_marking: toInt(row.defending_marking_awareness),
    defending_standing_tackle: toInt(row.defending_standing_tackle),
    defending_sliding_tackle: toInt(row.defending_sliding_tackle),

    // Goalkeeping
    goalkeeping_diving: toInt(row.goalkeeping_diving),
    goalkeeping_handling: toInt(row.goalkeeping_handling),
    goalkeeping_kicking: toInt(row.goalkeeping_kicking),
    goalkeeping_positioning: toInt(row.goalkeeping_positioning),
    goalkeeping_reflexes: toInt(row.goalkeeping_reflexes),
    goalkeeping_speed: toInt(row.goalkeeping_speed),

    player_traits: row.player_traits || null
});
