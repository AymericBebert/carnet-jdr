import {Routes} from '@angular/router';
import {CharacterPageComponent} from './character/character-page/character-page.component';
import {characterResolver} from './character/character-resolver';
import {CharacterRootComponent} from './character/character-root/character-root.component';
import {charactersResolver} from './character/characters-resolver';
import {EditCharacterPageComponent} from './character/edit-character-page/edit-character-page.component';
import {NewCharacterPageComponent} from './character/new-character-page/new-character-page.component';
import {pendingChangesGuard} from './confirm/pending-changes.guard';
import {HomeComponent} from './home/home.component';
import {closeDialogsChildGuard} from './nav/close-dialogs.guard';
import {SpellsChoiceComponent} from './spells/spells-choice/spells-choice.component';
import {SpellsListPageComponent} from './spells/spells-list-page/spells-list-page.component';

export const routes: Routes = [
  {
    path: '',
    canActivateChild: [closeDialogsChildGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
        resolve: {characters: charactersResolver},
        data: {
          navTools: [
            {name: 'Ré-ordonner', icon: 'swap_vert'},
          ],
        },
      },
      {
        path: 'new-character',
        component: NewCharacterPageComponent,
        data: {
          backRouterNavigate: '/',
          navButtons: ['done'],
          navTools: [
            {name: 'Créer', icon: 'done'},
            {name: 'Importer perso', icon: 'upload'},
          ],
        },
        canDeactivate: [pendingChangesGuard],
      },
      {
        path: 'character/:id',
        component: CharacterRootComponent,
        resolve: {character: characterResolver},
        children: [
          {
            path: '',
            component: CharacterPageComponent,
            data: {
              backRouterNavigate: '/',
              navButtons: ['menu_book'],
              navTools: [
                {name: 'Modifier perso', icon: 'edit'},
                {name: 'Modifier sorts', icon: 'menu_book'},
                {name: 'Exporter perso', icon: 'download'},
              ],
            },
          },
          {
            path: 'edit',
            component: EditCharacterPageComponent,
            data: {
              backRouterNavigate: '[back]',
              navButtons: ['done'],
              navTools: [
                {name: 'Sauvegarder', icon: 'done'},
                {name: 'Supprimer perso', icon: 'delete'},
              ],
            },
            canDeactivate: [pendingChangesGuard],
          },
          {
            path: 'spells',
            component: SpellsChoiceComponent,
            data: {
              backRouterNavigate: '[back]',
              navButtons: ['done'],
              navTools: [
                {name: 'Sauvegarder', icon: 'done'},
              ],
            },
            canDeactivate: [pendingChangesGuard],
          },
        ]
      },
      {
        path: 'spells',
        component: SpellsListPageComponent,
        data: {
          backRouterNavigate: '/',
        },
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
