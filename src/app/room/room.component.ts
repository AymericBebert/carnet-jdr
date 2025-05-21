import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {NavButtonsService} from '../nav/nav-buttons.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  imports: [
    MatExpansionModule,
    MatIconModule,
  ],
})
export class RoomComponent implements OnInit {
  private readonly navButtonsService = inject(NavButtonsService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.navButtonsService.navButtonClicked$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(btn => {
        // switch (btn) {
        //   case 'share':
        //     this.shareRoom(this.displayedRoom());
        //     break;
        // }
      });
  }
}
