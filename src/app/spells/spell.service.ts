import {Injectable} from '@angular/core';
import {Spell, SpellChoices, SpellFilter, toSpellChoice} from './spell.model';
import {spellsFr} from './spells-fr';

@Injectable({
  providedIn: 'root',
})
export class SpellService {
  public getSpells(filter?: SpellFilter, spellChoices?: SpellChoices): Spell[] {
    if (!filter || Object.keys(filter).length === 0) {
      return spellsFr;
    }
    const filterNameCanonical = filter.name ? this.canonicalForm(filter.name) : null;
    return spellsFr.filter(spell => {
      if (filterNameCanonical != null && !this.canonicalForm(spell.name).includes(filterNameCanonical)) {
        return false;
      }
      if (filter.level != null && !filter.level.includes(spell.level)) {
        return false;
      }
      if (filter.classes != null && !spell.classes.some(c => filter.classes!.includes(c))) {
        return false;
      }
      if (!spellChoices) {
        return true; // No spell choices provided, return all spells that match the other filters
      }
      const spellChoice = spellChoices[spell.id] || toSpellChoice({});
      if (filter.known != null && spellChoice.known !== filter.known) {
        return false;
      }
      if (filter.prepared != null && (spellChoice.prepared || spellChoice.alwaysPrepared) !== filter.prepared) {
        return false;
      }
      if (filter.favorite != null && spellChoice.favorite !== filter.favorite) {
        return false;
      }
      return true;
    });
  }

  public getSpell(spellId: string): Spell | undefined {
    return spellsFr.find(spell => spell.id === spellId);
  }

  private canonicalForm(text: string): string {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
