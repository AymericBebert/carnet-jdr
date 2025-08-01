import {Directive, HostListener, inject} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SpellDialogComponent, SpellDialogData} from '../spells/spell-dialog/spell-dialog.component';
import {SpellService} from '../spells/spell.service';

@Directive({
  selector: '[appInterceptLinks]',
})
export class InterceptLinksDirective {
  private readonly dialog = inject(MatDialog);
  private readonly spellService = inject(SpellService);

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'A') {
      const href = target.getAttribute('href');
      const spellId = href && href.match(/^jdr-spell:\/\/(.+)$/)?.[1] || null;
      const spell = spellId && this.spellService.getSpell(spellId) || null;
      if (spell) {
        // Do not follow the link, open the spell dialog instead
        event.preventDefault();
        this.dialog.open<SpellDialogComponent, SpellDialogData>(SpellDialogComponent, {
          data: {spell},
          autoFocus: '.close-button',
          closeOnNavigation: false,
        });
      }

      // Avoid closing spell card when clicking on the link
      event.stopPropagation();
    }
  }
}
