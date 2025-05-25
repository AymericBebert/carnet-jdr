import {getRandomString} from '../utils/get-random-string';

export const abilityRefillTriggers = ['manually', 'longRest', 'longRestDie', 'shortRest', 'shortRestDie'] as const;
export type AbilityRefillTrigger = typeof abilityRefillTriggers[number];

export interface Ability {
  id: string;
  name: string;
  image: string;
  description: string;
  details: string;
  maxSlots: number;
  refillWhen: AbilityRefillTrigger;
  refillDie: number;
}

export function getNewAbility(): Ability {
  return {
    id: getRandomString(8),
    name: '',
    image: '',
    description: '',
    details: '',
    maxSlots: 0,
    refillWhen: 'manually',
    refillDie: 0,
  };
}

export interface AbilityUsage {
  id: string;
  usage: number;
}
