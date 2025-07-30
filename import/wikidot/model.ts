import {CharacterClass} from '../../src/app/character/character.model';

export const charClasses = [
  'artificer',
  'bard',
  'cleric',
  'druid',
  'paladin',
  'ranger',
  'sorcerer',
  'warlock',
  'wizard',
];

export const characterClassesToFr: Record<string, CharacterClass> = {
  artificer: 'Artificier',
  bard: 'Barde',
  cleric: 'Clerc',
  druid: 'Druide',
  paladin: 'Paladin',
  ranger: 'Rôdeur',
  sorcerer: 'Ensorceleur',
  warlock: 'Occultiste',
  wizard: 'Magicien',
};
