/**
 * Run with `npx tsx import/wikidot/parse-spell-classes.ts`
 *
 * This script is used to generate a crude version of spells source file
 */
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import {Spell} from '../../src/app/spells/spell.model';
import {characterClassesToFr, charClasses} from './model';

function strSanitize(str: string): string {
  return str.trim().replace(/['´]/g, '’');
}

function parseClassFile(charClass: string): Spell[] {
  const spellsHtml = fs.readFileSync(
    path.resolve(__dirname, 'spell-classes', `${charClass}.html`),
    {encoding: 'utf8'},
  );

  const cheerioHtml = cheerio.load(spellsHtml);

  const spells: Spell[] = [];

  // Select all table rows in the relevant tables
  cheerioHtml('.yui-content .list-pages-box table.wiki-content-table').each((idx, table) => {
    cheerioHtml(table)
      .find('tr')
      .slice(1) // skip header row
      .each((_, row) => {
        const $row = cheerioHtml(row);
        const columns = $row.find('td');
        if (columns.length < 6) return; // skip malformed rows

        // Extract raw values
        const link = columns.eq(0).find('a');
        const href = link.attr('href') || '';
        const name = strSanitize(link.text());
        // <td><a href="/spell:absorb-elements">Absorb Elements</a></td>
        const id = href.replace('/spell:', '').trim();

        const school = columns.eq(1).text().trim();
        const incantation = columns.eq(2).text().trim(); // casting time
        const range = columns.eq(3).text().trim();
        const duration = columns.eq(4).text().trim();
        const components = columns.eq(5).text().trim();

        // Parse components
        const verbal = components.includes('V');
        const somatic = components.includes('S');
        const material = components.includes('M');

        // Detect concentration
        const concentration = /concentration/i.test(duration);

        // Placeholder/default values for missing fields
        const vo = '';
        const level = idx; // Cantrips = 0
        const description = '';
        const source = '';
        const ritual = false; // Would need another field/marker
        const details = '';

        spells.push({
          id,
          name,
          vo,
          level,
          school,
          incantation,
          range,
          verbal,
          somatic,
          material,
          concentration,
          ritual,
          description,
          source,
          classes: [characterClassesToFr[charClass]],
          details,
        });
      });
  });

  return spells;
}

function main(): void {
  const spells: Spell[] = [];
  for (const charClass of charClasses) {
    spells.push(...parseClassFile(charClass));
  }

  console.log(spells[0]);

  // Generate TypeScript content
  let tsContent = `import {Spell} from './spell.model';

/* eslint-disable max-len */

export const spellsEn: Spell[] = [
`;

  for (const spell of spells) {
    tsContent += `  {
    id: '${spell.id}',
    name: '${spell.name}',
    vo: '${spell.vo}',
    level: ${spell.level},
    school: '${spell.school}',
    incantation: '${spell.incantation}',
    range: '${spell.range}',
    verbal: ${spell.verbal},
    somatic: ${spell.somatic},
    material: ${spell.material},
    concentration: ${spell.concentration},
    ritual: ${spell.ritual},
    description: '${spell.description}',
    source: '${spell.source}',
    classes: ['${spell.classes.join('\', \'')}'],
    details: '${spell.details}',
  },
`;
  }

  tsContent += '];\n';

  // Save to TS file
  const outputPath = path.resolve(__dirname, 'spells-en.ts');
  fs.writeFileSync(outputPath, tsContent, {encoding: 'utf8'});

  console.log(`Successfully wrote to ${outputPath}`);
}

try {
  main();
  console.log('success');
  process.exit(0);
} catch (err) {
  console.error('failed', err);
  process.exit(1);
}
