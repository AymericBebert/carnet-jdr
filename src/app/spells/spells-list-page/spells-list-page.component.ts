import {Component} from '@angular/core';
import {FilterableSpellsListComponent} from '../filterable-spells-list/filterable-spells-list.component';

@Component({
  selector: 'app-spells-list-page',
  templateUrl: './spells-list-page.component.html',
  styleUrls: ['./spells-list-page.component.scss'],
  imports: [
    FilterableSpellsListComponent,
  ],
})
export class SpellsListPageComponent {
}
