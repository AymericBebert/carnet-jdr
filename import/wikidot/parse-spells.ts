/**
 * Run with `npx tsx import/wikidot/parse-spells.ts`
 *
 * This script is used to generate spells source file
 */
import * as cheerio from 'cheerio';
import fs from 'fs';
import * as process from 'node:process';
import path from 'path';
import {CharacterClass} from '../../src/app/character/character.model';
import {Spell} from '../../src/app/spells/spell.model';
import {characterClassesToFr} from './model';

function strSanitize(str: string): string {
  return str.trim().replace(/['´]/g, '’').replace(/(?!\\)\n/g, '\\n');
}

function parseSpellPage(html: string, id: string): Spell {
  const $ = cheerio.load(html);

  const content = $('.main-content #page-content');

  const paragraphs = content.find('p').toArray();

  // 0. Name
  const name = strSanitize($('.main-content .page-title span').text());

  // 1. Source
  const source = strSanitize($(paragraphs[0]).text().replace(/^Source:\s*/i, ''));

  // 2. School and level
  // Example: "Conjuration cantrip" or "1st-level abjuration"
  let school = '?';
  let level = 0;
  const schoolLine = $(paragraphs[1]).text().toLowerCase().trim();
  if (schoolLine.includes('cantrip')) {
    school = schoolLine.replace('cantrip', '').trim();
  } else {
    const [levelRaw, schoolRaw] = schoolLine.split(/\s+(?=\w)/); // first word = level, rest = school
    if (/(\d+)(st|nd|rd|th)/i.test(levelRaw)) {
      level = parseInt(levelRaw, 10);
      school = schoolRaw;
    }
  }

  // 3. Casting Time / Range / Components / Duration
  const detailsHtml = $(paragraphs[2]).html() || '';
  const detailsText = detailsHtml
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?strong>/g, '');
  const detailsMap: Record<string, string> = {};
  detailsText.split('\n').forEach(line => {
    const [key, value] = line.split(/:(.+)/).map(s => s.trim()).filter(s => !!s);
    if (key && value) detailsMap[key.toLowerCase()] = value;
  });

  const incantation = detailsMap['casting time'] || '';
  const range = detailsMap['range'] || '';
  const componentsStr = detailsMap['components'] || '';
  const duration = detailsMap['duration'] || '';

  // Components booleans
  const verbal = /V/.test(componentsStr);
  const somatic = /S/.test(componentsStr);
  const material = /M/.test(componentsStr);

  const concentration = /concentration/i.test(duration);
  const ritual = /ritual/i.test(componentsStr);

  // 4. Description (all paragraphs after index 3 until we hit "Spell Lists")
  const descriptionParts: string[] = [];
  for (let i = 3; i < paragraphs.length; i++) {
    const p = $(paragraphs[i]);
    const htmlText = p.html() || '';
    if (htmlText.toLowerCase().includes('spell lists')) break;
    descriptionParts.push(strSanitize(p.text()));
  }
  const details = descriptionParts.join('\\n');

  // 5. Classes (from last paragraph containing "Spell Lists.")
  let classes: CharacterClass[] = [];
  const spellListParagraph = paragraphs.find(p =>
    $(p).text().toLowerCase().includes('spell lists')
  );
  if (spellListParagraph) {
    classes = $(spellListParagraph)
      .find('a')
      .toArray()
      .map(a => {
        const classText = $(a).text().toLowerCase().replace(/ \(\w+\)/, '').trim();
        return characterClassesToFr[classText];
      })
      .filter((c): c is CharacterClass => !!c);
  }

  // Build the spell
  return {
    id,
    name,
    vo: '',
    level,
    school,
    incantation,
    range,
    verbal,
    somatic,
    material,
    concentration,
    ritual,
    description: '',
    source,
    classes,
    details,
  };
}

function parseSpellFiles(): Spell[] {
  const spellFiles = fs.readdirSync(path.resolve(__dirname, 'spells')).filter(file => file.endsWith('.html'));

  const spells: Spell[] = [];

  for (const spellFile of spellFiles) {
    const spellHtml = fs.readFileSync(path.resolve(__dirname, 'spells', spellFile), {encoding: 'utf8'});
    const spell = parseSpellPage(spellHtml, spellFile.replace('.html', ''));
    spells.push(spell);
  }

  return spells;
}

function main(): void {
  const spells = parseSpellFiles();

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
