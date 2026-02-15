import { PlayerModel } from '../models/player';

export interface SkillGroupConfig {
    title: string;
    keys: (keyof PlayerModel)[];
}

export const PLAYER_SKILLS_CONFIG: SkillGroupConfig[] = [
    {
        title: 'Core Attributes',
        keys: [
            'pace',
            'shooting',
            'passing',
            'dribbling',
            'defending',
            'physic'
        ]
    },
    {
        title: 'Attacking Skills',
        keys: [
            'attacking_crossing',
            'attacking_finishing',
            'attacking_heading_accuracy',
            'attacking_short_passing',
            'attacking_volleys'
        ]
    },
    {
        title: 'Technical Skills',
        keys: [
            'skill_dribbling',
            'skill_curve',
            'skill_fk_accuracy',
            'skill_long_passing',
            'skill_ball_control'
        ]
    },
    {
        title: 'Movement',
        keys: [
            'movement_acceleration',
            'movement_sprint_speed',
            'movement_agility',
            'movement_reactions',
            'movement_balance'
        ]
    },
    {
        title: 'Power',
        keys: [
            'power_shot_power',
            'power_jumping',
            'power_stamina',
            'power_strength',
            'power_long_shots'
        ]
    },
    {
        title: 'Mentality',
        keys: [
            'mentality_aggression',
            'mentality_interceptions',
            'mentality_positioning',
            'mentality_vision',
            'mentality_penalties',
            'mentality_composure'
        ]
    },
    {
        title: 'Defending',
        keys: [
            'defending_marking',
            'defending_standing_tackle',
            'defending_sliding_tackle'
        ]
    },
    {
        title: 'Goalkeeping',
        keys: [
            'goalkeeping_diving',
            'goalkeeping_handling',
            'goalkeeping_kicking',
            'goalkeeping_positioning',
            'goalkeeping_reflexes',
            'goalkeeping_speed'
        ]
    }
];
