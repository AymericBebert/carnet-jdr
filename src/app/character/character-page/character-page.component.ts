import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from '@angular/router';
import {CharacterCardComponent} from '../character-card/character-card.component';
import {Character} from '../character.model';
import {CharacterService} from '../character.service';


@Component({
  selector: 'app-character-page',
  templateUrl: './character-page.component.html',
  styleUrls: ['./character-page.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    CharacterCardComponent,
  ],
})
export class CharacterPageComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly character = signal<Character | null>(null);

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this.character.set(data.character);
      });
  }
}

export const characterResolver: ResolveFn<Character> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
) => {
  return inject(CharacterService).getCharacter(route.paramMap.get('id')!);
};
