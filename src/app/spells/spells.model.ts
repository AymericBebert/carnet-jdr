import {CharacterClass} from '../character/character.model';

export interface Spell {
  id: string;
  name: string;
  vo: string;
  level: number;
  school: string;
  incantation: string;
  range: string;
  verbal: boolean;
  somatic: boolean;
  material: boolean;
  concentration: boolean;
  ritual: boolean;
  description: string;
  source: string;
  classes: CharacterClass[];
  details: string;
}
