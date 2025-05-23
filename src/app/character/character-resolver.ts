import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from '@angular/router';
import {Character} from './character.model';
import {CharacterService} from './character.service';

export const characterResolver: ResolveFn<Character> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
) => {
  return inject(CharacterService).getCharacter(route.paramMap.get('id')!);
};
