import {Ability, AbilityUsage} from '../ability/ability.model';
import {SpellChoices} from '../spells/spell.model';
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
  order: number;
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
    order: character.order || 0,
  };
}

export interface Character extends CharacterHeader {
  abilities: Ability[];
  abilityUsage: AbilityUsage;
  mustPrepareSpells: boolean;
  spellSlots: number[];
  spellSlotBurns: number[];
  spellChoices: SpellChoices;
  order: number;
}

export function toCharacter(character: Partial<Character>): Character {
  return {
    ...toCharacterHeader(character),
    abilities: character.abilities || [],
    abilityUsage: character.abilityUsage || {},
    mustPrepareSpells: character.mustPrepareSpells ?? true,
    spellSlots: character.spellSlots || [],
    spellSlotBurns: (character.spellSlots || []).map((_, i) => character.spellSlotBurns?.[i] || 0),
    spellChoices: character.spellChoices || {},
    order: character.order || 0,
  };
}

// Remove things that are character live params, not stats
const _notInCharacterEditDto = [
  'id',
  'hp',
  'hpTemp',
  'abilityUsages',
  'spellSlotBurns',
  'spellChoices',
];
export type CharacterEditDto = Omit<Character, typeof _notInCharacterEditDto[number]>

export function toCharacterEditDto(character: Partial<Character>): CharacterEditDto {
  return removeUndefinedValues({
    ...toCharacter(character),
    id: undefined,
    hp: undefined,
    hpTemp: undefined,
    abilityUsages: undefined,
    spellSlotBurns: undefined,
    spellChoices: undefined,
  }) as CharacterEditDto;
}
