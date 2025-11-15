import {CharacterClass} from '../character/character.model';
import {getRandomString} from '../utils/get-random-string';

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

export function getNewSpell(base: Partial<Spell> = {}): Spell {
  return {
    id: base.id || getRandomString(8),
    name: base.name || '',
    vo: base.vo || '',
    level: base.level || 0,
    school: base.school || '',
    incantation: base.incantation || '',
    range: base.range || '',
    verbal: base.verbal || false,
    somatic: base.somatic || false,
    material: base.material || false,
    concentration: base.concentration || false,
    ritual: base.ritual || false,
    description: base.description || '',
    source: base.source || '',
    classes: base.classes || [],
    details: base.details || '',
  };
}

export interface SpellChoice<B = boolean> {
  known: B;
  prepared: B;
  alwaysPrepared: B;
  favorite: B;
}

export function toSpellChoice(choice: Partial<SpellChoice<boolean | null>>): SpellChoice {
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
  /** Will not be filtered out, but used to shadow spells needing concentration */
  concentrating?: boolean | null;
}
