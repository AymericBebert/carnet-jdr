import {inject, Injectable} from '@angular/core';
import {DBSchema, IDBPDatabase, openDB} from 'idb';
import {ConfirmService} from '../confirm/confirm.service';
import {getRandomString} from '../utils/get-random-string';
import {Character, CharacterHeader, NewCharacterDto, toCharacter, toCharacterHeader} from './character.model';

interface CharacterDB extends DBSchema {
  characters: {
    key: string;
    value: Character;
  };
}

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private readonly confirm = inject(ConfirmService);

  private dbPromise: Promise<IDBPDatabase<CharacterDB>> | null = null;

  public async createCharacter(character: NewCharacterDto): Promise<void> {
    const id = getRandomString(8);
    const newCharacter: Character = {
      ...character,
      id,
      hpTemp: 0,
      skillWithSlots: [],
      spellChoices: [],
      spellSlots: [],
    };
    const db = await this.getDb();
    await db.put('characters', newCharacter);
  }

  public async listCharacters(): Promise<CharacterHeader[]> {
    const db = await this.getDb();
    const all = await db.getAll('characters');
    return all.map(char => toCharacterHeader(char));
  }

  public async getCharacter(id: string): Promise<Character> {
    const db = await this.getDb();
    const character = await db.get('characters', id);
    if (!character) throw new Error('Character not found');
    return toCharacter(character);
  }

  public async updateCharacter(id: string, update: Partial<Character>): Promise<Character> {
    const db = await this.getDb();
    const existing = await db.get('characters', id);
    if (!existing) throw new Error('Character not found');
    const updated = {...existing, ...update};
    await db.put('characters', updated);
    return toCharacter(updated);
  }

  public async deleteCharacter(toDelete: Character): Promise<boolean> {
    const confirmed = await this.confirm.confirm({
      // eslint-disable-next-line no-irregular-whitespace
      title: `Supprimer ${toDelete.name} ?`,
      description: 'Cette action est irréversible.',
      yesText: 'Supprimer',
      yesColor: 'warn',
    });
    if (confirmed) {
      const db = await this.getDb();
      await db.delete('characters', toDelete.id);
      return true;
    }
    return false;
  }

  private getDb() {
    if (!this.dbPromise) {
      this.dbPromise = openDB<CharacterDB>('character-db', 1, {
        upgrade(db) {
          db.createObjectStore('characters', {keyPath: 'id'});
        },
      });
    }
    return this.dbPromise;
  }
}
