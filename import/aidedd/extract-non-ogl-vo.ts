/**
 * Run with `npx tsx import/aidedd/extract-non-ogl-vo.ts`
 *
 * This script is used to patch "non-ogl" spells from aidedd, inserting the spell details
 */
import fs from 'fs';
import path from 'path';
import {Spell} from '../../src/app/spells/spell.model';
import {spellsFr} from '../../src/app/spells/spells-fr';
import {spellsEn} from '../wikidot/spells-en';

function levenshtein(a: string, b: string): number {
  const an = a.length;
  const bn = b.length;
  if (an == 0) {
    return bn;
  }
  if (bn == 0) {
    return an;
  }
  const matrix = new Array<number[]>(bn + 1);
  for (let i = 0; i <= bn; ++i) {
    const row = (matrix[i] = new Array<number>(an + 1));
    row[0] = i;
  }
  const firstRow = matrix[0];
  for (let j = 1; j <= an; ++j) {
    firstRow[j] = j;
  }
  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]!;
      } else {
        matrix[i][j] =
          Math.min(
            matrix[i - 1][j - 1], // substitution
            matrix[i][j - 1], // insertion
            matrix[i - 1][j] // deletion
          ) + 1;
      }
    }
  }
  return matrix[bn][an];
}

function main(): void {
  const spellToVO: Record<string, string> = {};
  for (const spellFr of spellsFr) {
    if (spellFr.details.includes('(non OGL)')) {
      let closestEnSpell: { spell: Spell; distance: number } | undefined = undefined;
      for (const spellEn of spellsEn) {
        const distance = levenshtein(spellFr.vo, spellEn.name);
        if (distance <= 2) { // Allow a small distance for typos
          if (!closestEnSpell || distance < closestEnSpell.distance) {
            closestEnSpell = {spell: spellEn, distance};
          }
        }
      }
      if (closestEnSpell) {
        spellToVO[spellFr.id] = closestEnSpell.spell.details;
      } else {
        console.warn(`No close match found for ${spellFr.name}`);
        spellToVO[spellFr.id] = '';
      }
    }
  }

  const outputPath = path.resolve(__dirname, 'non-ogl-vo.json');
  fs.writeFileSync(outputPath, JSON.stringify(spellToVO, null, 2), {encoding: 'utf8'});
  console.log(`Successfully wrote ${outputPath}`);
}

try {
  main();
  console.log('success');
  process.exit(0);
} catch (err) {
  console.error('failed', err);
  process.exit(1);
}
