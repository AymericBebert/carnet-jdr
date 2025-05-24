import {Routes} from '@angular/router';
import {CharacterPageComponent} from './character/character-page/character-page.component';
import {characterResolver} from './character/character-resolver';
import {EditCharacterPageComponent} from './character/edit-character-page/edit-character-page.component';
import {NewCharacterPageComponent} from './character/new-character-page/new-character-page.component';
import {HomeComponent} from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'new-character',
    component: NewCharacterPageComponent,
    data: {
      backRouterNavigate: '/',
    },
  },
  {
    path: 'character/:id',
    component: CharacterPageComponent,
    resolve: {character: characterResolver},
    data: {
      backRouterNavigate: '/',
      navButtons: ['menu_book'],
      navTools: [
        {name: 'Modifier perso', icon: 'edit'},
        {name: 'Modifier pouvoirs', icon: 'flare'},
        {name: 'Modifier sorts', icon: 'menu_book'},
      ],
    },
  },
  {
    path: 'edit-character/:id',
    component: EditCharacterPageComponent,
    resolve: {character: characterResolver},
    data: {
      backRouterNavigate: '[back]',
    },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
