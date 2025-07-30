/**
 * Run with `npx tsx import/wikidot/download-spells.ts`
 *
 * This script is used to download html files of spells
 */
import fs from 'fs';
import path from 'path';
import {spellsEn} from './spells-en';

async function main(): Promise<void> {
  for (const spell of spellsEn) {
    const url = `https://dnd5e.wikidot.com/spell:${spell.id}`;

    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.statusText}`);
      continue;
    }
    const htmlContent = await response.text();

    const outputPath = path.resolve(__dirname, 'spells', `${spell.id}.html`);
    fs.writeFileSync(outputPath, htmlContent, {encoding: 'utf8'});
    console.log(`Successfully wrote ${outputPath}`);
  }
}

main()
  .then(() => {
    console.log('success');
    process.exit(0);
  })
  .catch(err => {
    console.error('failed', err);
    process.exit(1);
  });
