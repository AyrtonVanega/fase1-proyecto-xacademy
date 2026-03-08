const { DataTypes } = require("sequelize");

const ratingValidation = () => ({
  type: DataTypes.INTEGER,
  validate: {
    isInt: true,
    min: 0,
    max: 100,
  },
});

const smallRatingValidation = () => ({
  type: DataTypes.INTEGER,
  validate: {
    isInt: true,
    min: 1,
    max: 5,
  },
});

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Player", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    fifa_version: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true, len: [1, 255] },
    },

    fifa_update: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true, len: [1, 255] },
    },

    player_face_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true, isUrl: true },
    },

    long_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true, len: [1, 255] },
    },

    player_positions: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },

    club_name: {
      type: DataTypes.STRING,
      validate: { len: [0, 255] },
    },

    nationality_name: {
      type: DataTypes.STRING,
      validate: { len: [0, 255] },
    },

    overall: {
      ...ratingValidation(),
      allowNull: false,
    },

    potential: {
      ...ratingValidation(),
      allowNull: false,
    },

    value_eur: {
      type: DataTypes.INTEGER,
      validate: { isInt: true, min: 0 },
    },

    wage_eur: {
      type: DataTypes.INTEGER,
      validate: { isInt: true, min: 0 },
    },

    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { isInt: true, min: 15, max: 60 },
    },

    height_cm: {
      type: DataTypes.INTEGER,
      validate: { isInt: true, min: 120, max: 230 },
    },

    weight_kg: {
      type: DataTypes.INTEGER,
      validate: { isInt: true, min: 40, max: 150 },
    },

    preferred_foot: {
      type: DataTypes.STRING,
      validate: { isIn: [["Left", "Right"]] },
    },

    weak_foot: smallRatingValidation(),
    skill_moves: smallRatingValidation(),
    international_reputation: smallRatingValidation(),

    work_rate: {
      type: DataTypes.STRING,
      validate: { len: [0, 255] },
    },

    body_type: {
      type: DataTypes.STRING,
      validate: { len: [0, 255] },
    },

    // Ratings 0–100
    pace: ratingValidation(),
    shooting: ratingValidation(),
    passing: ratingValidation(),
    dribbling: ratingValidation(),
    defending: ratingValidation(),
    physic: ratingValidation(),

    attacking_crossing: ratingValidation(),
    attacking_finishing: ratingValidation(),
    attacking_heading_accuracy: ratingValidation(),
    attacking_short_passing: ratingValidation(),
    attacking_volleys: ratingValidation(),

    skill_dribbling: ratingValidation(),
    skill_curve: ratingValidation(),
    skill_fk_accuracy: ratingValidation(),
    skill_long_passing: ratingValidation(),
    skill_ball_control: ratingValidation(),

    movement_acceleration: ratingValidation(),
    movement_sprint_speed: ratingValidation(),
    movement_agility: ratingValidation(),
    movement_reactions: ratingValidation(),
    movement_balance: ratingValidation(),

    power_shot_power: ratingValidation(),
    power_jumping: ratingValidation(),
    power_stamina: ratingValidation(),
    power_strength: ratingValidation(),
    power_long_shots: ratingValidation(),

    mentality_aggression: ratingValidation(),
    mentality_interceptions: ratingValidation(),
    mentality_positioning: ratingValidation(),
    mentality_vision: ratingValidation(),
    mentality_penalties: ratingValidation(),
    mentality_composure: ratingValidation(),

    defending_marking: ratingValidation(),
    defending_standing_tackle: ratingValidation(),
    defending_sliding_tackle: ratingValidation(),

    goalkeeping_diving: ratingValidation(),
    goalkeeping_handling: ratingValidation(),
    goalkeeping_kicking: ratingValidation(),
    goalkeeping_positioning: ratingValidation(),
    goalkeeping_reflexes: ratingValidation(),
    goalkeeping_speed: ratingValidation(),

    player_traits: {
      type: DataTypes.STRING,
      validate: { len: [0, 255] },
    },

  }, {
    tableName: "players",
    timestamps: false,
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ["fifa_version", "long_name"]
      }
    ]
  })
};
