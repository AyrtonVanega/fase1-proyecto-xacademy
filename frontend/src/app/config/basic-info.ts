import { PlayerModel } from '../models/player';

export interface BasicInfoConfig {
    key: keyof PlayerModel;
    label: string;
    type: 'text' | 'number' | 'select';
    min?: number;
    max?: number;
}

export const BASIC_INFO_CONFIG: BasicInfoConfig[] = [
    { key: 'long_name', label: 'Nombre Completo', type: 'text' },
    { key: 'age', label: 'Edad', type: 'number', min: 0, max: 100 },
    { key: 'nationality_name', label: 'Nacionalidad', type: 'text' },
    { key: 'club_name', label: 'Club', type: 'text' },
    { key: 'player_positions', label: 'Posiciones', type: 'text' },
    { key: 'overall', label: 'Overall', type: 'number', min: 0, max: 100 },
    { key: 'potential', label: 'Potential', type: 'number', min: 0, max: 100 },
    { key: 'fifa_version', label: 'FIFA Version', type: 'text' },
    { key: 'fifa_update', label: 'FIFA Update', type: 'text' },
    { key: 'player_face_url', label: 'URL Foto', type: 'text' },
    { key: 'value_eur', label: 'Valor (€)', type: 'number' },
    { key: 'wage_eur', label: 'Sueldo (€)', type: 'number' },
    { key: 'height_cm', label: 'Altura (cm)', type: 'number' },
    { key: 'weight_kg', label: 'Peso (kg)', type: 'number' },
    { key: 'preferred_foot', label: 'Pie Preferido', type: 'select' },
    { key: 'weak_foot', label: 'Weak Foot', type: 'number', min: 0, max: 5 },
    { key: 'skill_moves', label: 'Skill Moves', type: 'number', min: 0, max: 5 },
    { key: 'international_reputation', label: 'Reputación Internacional', type: 'number', min: 0, max: 5 },
    { key: 'work_rate', label: 'Work Rate', type: 'text' },
    { key: 'body_type', label: 'Tipo de Cuerpo', type: 'text' },
    { key: 'player_traits', label: 'Rasgos del Jugador', type: 'text' },
];
