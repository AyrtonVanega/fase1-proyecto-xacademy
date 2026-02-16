import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ALL_SKILL_KEYS } from '../config/player-skill';

export function buildPlayerForm(fb: FormBuilder): FormGroup {

    const ratingValidators = [
        Validators.required,
        Validators.min(0),
        Validators.max(100)
    ];

    const smallRatingValidators = [
        Validators.min(1),
        Validators.max(5)
    ];

    const skillControls = ALL_SKILL_KEYS.reduce((acc, key) => {
        acc[key] = [0, ratingValidators];
        return acc;
    }, {} as Record<string, any>);

    return fb.group({
        id: [{ value: 0, disabled: true }],

        fifa_version: ['', [Validators.required, Validators.maxLength(255)]],
        fifa_update: ['', [Validators.required, Validators.maxLength(255)]],
        player_face_url: ['', [Validators.required, Validators.pattern(/https?:\/\/.+/)]],
        long_name: ['', [Validators.required, Validators.maxLength(255)]],
        player_positions: ['', Validators.required],

        club_name: ['', Validators.maxLength(255)],
        nationality_name: ['', Validators.maxLength(255)],

        overall: [0, ratingValidators],
        potential: [0, ratingValidators],

        value_eur: [0, [Validators.min(0)]],
        wage_eur: [0, [Validators.min(0)]],

        age: [18, [Validators.required, Validators.min(15), Validators.max(60)]],
        height_cm: [170, [Validators.min(120), Validators.max(230)]],
        weight_kg: [70, [Validators.min(40), Validators.max(150)]],

        preferred_foot: ['Left', Validators.required],

        weak_foot: [1, smallRatingValidators],
        skill_moves: [1, smallRatingValidators],
        international_reputation: [1, smallRatingValidators],

        work_rate: ['', Validators.maxLength(255)],
        body_type: ['', Validators.maxLength(255)],
        player_traits: ['', Validators.maxLength(255)],

        ...skillControls
    });
}
