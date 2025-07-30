/**
 * Run with `npx tsx import/aidedd/download.ts`
 *
 * This script is used to download html files of spell details
 */
import fs from 'fs';
import path from 'path';
import {spellsFr} from '../../src/app/spells/spells-fr';

async function main(): Promise<void> {
  for (const spell of spellsFr) {
    const url = `https://www.aidedd.org/dnd/sorts.php?vf=${encodeURIComponent(spell.id)}`;

    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.statusText}`);
      continue;
    }
    const htmlContent = await response.text();

    const outputPath = path.resolve(__dirname, 'details', `${spell.id}.html`);
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
