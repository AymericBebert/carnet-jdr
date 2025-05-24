export const characterClasses = [
  'Barde',
  'Clerc',
  'Druide',
  'Ensorceleur',
  'Magicien',
  'Occultiste',
  'Paladin',
  'Rôdeur',
  'Artificier',
] as const;
export type CharacterClass = typeof characterClasses[number];

export interface CharacterHeader {
  id: string;
  name: string;
  image: string;
  theme: number;
  game: string;
  class: CharacterClass;
  hp: number;
  hpMax: number;
  hpTemp: number;
  skillWithSlots: SkillWithSlots[];
  spellSlots: number[];
}

export function toCharacterHeader(character: Partial<Character>): CharacterHeader {
  return {
    id: character.id || '',
    name: character.name || '?',
    image: character.image || '',
    theme: character.theme || 0,
    game: character.game || '',
    class: character.class || 'Barde',
    hp: character.hp || 0,
    hpMax: character.hpMax || 0,
    hpTemp: character.hpTemp || 0,
    skillWithSlots: character.skillWithSlots || [],
    spellSlots: character.spellSlots || [],
  };
}

export type NewCharacterDto = Omit<CharacterHeader, 'id'>

export interface Character extends CharacterHeader {
  spellChoices: SpellChoice[];
}

export function toCharacter(character: Partial<Character>): Character {
  return {
    ...toCharacterHeader(character),
    hpTemp: character.hpTemp || 0,
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

export interface SpellChoice {
  id: string;
  prepared: boolean;
  favorite: boolean;
}
