import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {ActivatedRoute, Router} from '@angular/router';
import {NavButtonsService} from '../../nav/nav-buttons.service';
import {CharacterCardComponent} from '../character-card/character-card.component';
import {Character} from '../character.model';

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
  private readonly navButtonsService = inject(NavButtonsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly character = signal<Character | null>(null);

  ngOnInit(): void {
    this.route.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this.character.set(data.character);
      });

    this.navButtonsService.navButtonClicked$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(btn => {
        const char = this.character();
        switch (btn) {
          case 'edit':
            if (char) {
              void this.router.navigate(['../..', 'edit-character', char.id], {relativeTo: this.route});
            }
            break;
        }
      });
  }
}
