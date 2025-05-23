import {Routes} from '@angular/router';
import {CharacterPageComponent} from './character/character-page/character-page.component';
import {characterResolver} from './character/character-resolver';
import {EditCharacterPageComponent} from './character/edit-character-page/edit-character-page.component';
import {NewCharacterPageComponent} from './character/new-character-page/new-character-page.component';
import {HomeComponent} from './home/home.component';
import {RoomComponent} from './room/room.component';

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
      navButtons: ['edit'],
      // navTools: [{name: 'nav-tool.wheel', icon: 'near_me'}],
    },
  },
  {
    path: 'edit-character/:id',
    component: EditCharacterPageComponent,
    resolve: {character: characterResolver},
    data: {
      backRouterNavigate: '/',
    },
  },
  {
    path: 'room/:token',
    component: RoomComponent,
    data: {
      backRouterNavigate: '/',
      // navButtons: ['share'],
      // navTools: [{name: 'nav-tool.wheel', icon: 'near_me'}],
    },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
