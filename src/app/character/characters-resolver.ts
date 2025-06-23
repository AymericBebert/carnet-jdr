import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from '@angular/router';
import {SnackbarService} from '../service/snackbar.service';
import {CharacterHeader} from './character.model';
import {CharacterService} from './character.service';

export const charactersResolver: ResolveFn<CharacterHeader[]> = async (
  _route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
) => {
  try {
    return await inject(CharacterService).listCharacters();
  } catch (err) {
    inject(SnackbarService).openError('Error loading characters', err);
    return [];
  }
};
