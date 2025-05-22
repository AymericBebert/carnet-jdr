import {Routes} from '@angular/router';
import {CharacterPageComponent, characterResolver} from './character/character-page/character-page.component';
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
      // navButtons: ['share'],
      // navTools: [{name: 'nav-tool.wheel', icon: 'near_me'}],
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
