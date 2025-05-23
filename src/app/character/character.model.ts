export interface CharacterHeader {
  id: string;
  name: string;
  image: string;
  theme: number;
  game: string;
  hp: number;
  hpMax: number;
}

export function toCharacterHeader(character: Partial<Character>): CharacterHeader {
  return {
    id: character.id || '',
    name: character.name || '?',
    image: character.image || '',
    theme: character.theme || 0,
    game: character.game || '',
    hp: character.hp || 0,
    hpMax: character.hpMax || 0,
  };
}

export type NewCharacterDto = Omit<CharacterHeader, 'id'>

export interface Character extends CharacterHeader {
  hpTemp: number;
  skillWithSlots: SkillWithSlots[];
  spellChoices: SpellChoice[];
}

export function toCharacter(character: Partial<Character>): Character {
  return {
    ...toCharacterHeader(character),
    hpTemp: character.hpTemp || 0,
    skillWithSlots: character.skillWithSlots || [],
    spellChoices: character.spellChoices || [],
  };
}

export interface SkillWithSlots {
  name: string;
  image: string;
  description: string;
  slots: number;
  maxSlots: number;
  refillLongSleep: number;
  refillDieLongSleep: number;
}

export interface Spell {
  id: string;
  name: string;
  description: string;
  level: number;
  type: string;
  range: string;
  duration: string;
  castingTime: string;
  components: string[];
  classes: string[];
  school: string;
  source: string;
  page: number;
  material: string;
  ritual: boolean;
  concentration: boolean;
  attackType: string;
  damage: string;
  damageType: string;
  save: string;
  area: string;
  effect: string;
  target: string;
  targets: string;
  durationType: string;
  durationAmount: number;
  durationUnit: string;
}

export interface SpellChoice {
  id: string;
  prepared: boolean;
  favorite: boolean;
}
