import { PlayerModel } from './player';

export interface SkillGroupModel {
  title: string;
  labels: string[];
  keys: (keyof PlayerModel)[];
  data: number[];
  formFields: {
    key: keyof PlayerModel;
    label: string;
  }[];
}
