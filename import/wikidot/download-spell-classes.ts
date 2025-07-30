/**
 * Run with `npx tsx import/wikidot/download-spell-classes.ts`
 *
 * This script is used to download html files of spell list for each class
 */
import fs from 'fs';
import path from 'path';
import {charClasses} from './model';

async function main(): Promise<void> {
  for (const charClass of charClasses) {
    const url = `https://dnd5e.wikidot.com/spells:${charClass}`;

    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.statusText}`);
      continue;
    }
    const htmlContent = await response.text();

    const outputPath = path.resolve(__dirname, 'spell-classes', `${charClass}.html`);
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
