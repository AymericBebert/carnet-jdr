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

export interface SpellChoice {
  known: boolean;
  prepared: boolean;
  alwaysPrepared: boolean;
  favorite: boolean;
}

export function toSpellChoice(choice: Partial<SpellChoice>): SpellChoice {
  return {
    known: choice.known ?? false,
    prepared: choice.prepared ?? false,
    alwaysPrepared: choice.alwaysPrepared ?? false,
    favorite: choice.favorite ?? false,
  };
}

export type SpellChoices = Record<string, SpellChoice>;

export interface SpellFilter {
  name?: string | null;
  level?: number[] | null;
  classes?: CharacterClass[] | null;
  known?: boolean | null;
  prepared?: boolean | null;
  favorite?: boolean | null;
}
