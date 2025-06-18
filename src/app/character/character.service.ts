import {inject, Injectable} from '@angular/core';
import {DBSchema, IDBPDatabase, openDB} from 'idb';
import {Subject} from 'rxjs';
import {ConfirmService} from '../confirm/confirm.service';
import {getRandomString} from '../utils/get-random-string';
import {Character, CharacterEditDto, CharacterHeader, toCharacter, toCharacterHeader} from './character.model';

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
  public readonly characterUpdated$ = new Subject<string>();

  private dbPromise: Promise<IDBPDatabase<CharacterDB>> | null = null;

  public async createCharacter(character: CharacterEditDto): Promise<void> {
    const id = getRandomString(8);
    const currentChars = await this.listCharacters();
    const newCharacter = toCharacter({
      ...character,
      id,
      order: currentChars.length,
    });
    newCharacter.hp = newCharacter.hpMax;
    const db = await this.getDb();
    await db.put('characters', newCharacter);
  }

  public async listCharacters(): Promise<CharacterHeader[]> {
    const db = await this.getDb();
    const all = await db.getAll('characters');
    return all.map(char => toCharacterHeader(char)).sort((a, b) => a.order - b.order);
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
    this.characterUpdated$.next(id);
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

  public async updateCharacterOrder(ids: string[]): Promise<CharacterHeader[]> {
    const db = await this.getDb();
    const all = await db.getAll('characters');
    const updatedCharacters = all.map(char => {
      const index = ids.indexOf(char.id);
      if (index !== -1) {
        char.order = index;
      }
      return char;
    });
    await Promise.all(updatedCharacters.map(char => db.put('characters', char)));
    return updatedCharacters.map(char => toCharacterHeader(char)).sort((a, b) => a.order - b.order);
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
