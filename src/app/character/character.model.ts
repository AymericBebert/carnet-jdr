import {Ability, AbilityUsage} from '../ability/ability.model';
import {SpellChoice} from '../spells/spells.model';
import {removeUndefinedValues} from '../utils/remove-undefined-values';

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
  };
}

export interface Character extends CharacterHeader {
  abilities: Ability[];
  abilityUsages: AbilityUsage[];
  spellSlots: number[];
  spellChoices: SpellChoice[];
}

export function toCharacter(character: Partial<Character>): Character {
  return {
    ...toCharacterHeader(character),
    abilities: character.abilities || [],
    abilityUsages: character.abilityUsages || [],
    spellSlots: character.spellSlots || [],
    spellChoices: character.spellChoices || [],
  };
}

// Remove things that are character live params, not stats
export type CharacterEditDto = Omit<Character, 'id' | 'hp' | 'hpTemp' | 'abilityUsages' | 'spellChoices'>

export function toCharacterEditDto(character: Partial<Character>): CharacterEditDto {
  return removeUndefinedValues({
    ...toCharacter(character),
    id: undefined,
    hp: undefined,
    hpTemp: undefined,
    abilityUsages: undefined,
    spellChoices: undefined,
  }) as CharacterEditDto;
}
