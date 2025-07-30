/**
 * Run with `npx tsx import/aidedd/parse.ts`
 *
 * This script is used to generate spells source file
 */
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import {CharacterClass} from '../../src/app/character/character.model';
import {Spell} from '../../src/app/spells/spell.model';

function strSanitize(str: string): string {
  return str.replace(/['´]/g, '’');
}

function parseIndexFile(): Spell[] {
  const spellsHtml = fs.readFileSync(path.resolve(__dirname, 'sorts.html'), {encoding: 'utf8'});

  const cheerioHtml = cheerio.load(spellsHtml);

  // Parse each row in the table
  const spells: Spell[] = [];

  cheerioHtml('#liste tbody tr').each((_, row) => {
    const $row = cheerioHtml(row);
    const columns = $row.find('td');

    const $link = $row.find('td.item a');
    const href = $link.attr('href') || '';
    const idMatch = href.match(/vf=([^&]+)/);

    const id = strSanitize(idMatch ? decodeURIComponent(idMatch[1]) : '');
    const name = strSanitize($link.text().trim());
    const vo = strSanitize($row.find('td.colVO').text().trim());
    const level = parseInt(columns.eq(4).text().trim(), 10);
    const school = strSanitize(columns.eq(5).text().trim());
    const incantation = strSanitize(columns.eq(6).text().trim());
    const range = strSanitize(columns.eq(7).text().trim());
    const vsm = columns.eq(8).text().trim();
    const concentration = columns.eq(9).text().toLowerCase().includes('concentration');
    const ritual = columns.eq(10).text().toLowerCase().includes('rituel');
    const description = strSanitize(columns.eq(11).text().trim());
    const source = strSanitize(columns.eq(12).text().trim());

    const verbal = vsm.includes('V');
    const somatic = vsm.includes('S');
    const material = vsm.includes('M');

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
      classes: [],
      details: '',
    });
  });

  return spells;
}

function addDetailsFile(spell: Spell): void {
  const detailsHtml = fs.readFileSync(path.resolve(__dirname, 'details', `${spell.id}.html`), {encoding: 'utf8'});

  const cheerioHtml = cheerio.load(detailsHtml);

  // Extract class names
  cheerioHtml('.classe').each((_, el) => {
    spell.classes.push(cheerioHtml(el).text().trim() as CharacterClass);
  });
  cheerioHtml('.tcoe').each((_, el) => {
    spell.classes.push(cheerioHtml(el).text().trim().replace(/ \[TCoE]$/, '') as CharacterClass);
  });

  // Extract raw HTML of spell body
  const rawDetails = cheerioHtml('.col1').html() || '';
  spell.details = strSanitize(rawDetails
    .replace(/\n/g, ' ')
    .replace(
      /(?:<em>)?<a href="https:\/\/www.aidedd.org\/dnd\/sorts.php\?vf=([^&"]+)(?:&[^"]+)?">([^<]+)<\/a>(?:<\/em>)?/g,
      '<a href="jdr-spell://$1">$2</a>',
    )
    .replace(
      /<a href="https:\/\/www.aidedd.org\/dnd\/monstres.php([^"]+)">([^<]+)<\/a>/g,
      '<a href="https://www.aidedd.org/dnd/monstres.php$1" target="_blank">$2</a>',
    )
    .replace(/<h1>.*?<\/h1>/g, '')
    .replace(/<div class="trad">.*?<\/div>/g, '')
    .replace(/<div class="classe">.*?<\/div>/g, '')
    .replace(/<div class="tcoe">.*?<\/div>/g, '')
    .replace(/<div class="source">.*?<\/div>/g, '')
    .replace(/<ol itemscope=.*?<\/ol>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/<br><\/div>$/g, '</div>')
    .replace(/<div class="description">(.*?<br>.*?)<\/div>$/g, (_, p1: string) => {
      const paragraphs = p1.split('<br>').map(p => `<p>${p.trim()}</p>`).join('');
      return `<div class="description">${paragraphs}</div>`;
    })
  );
}

function patchArtificier(spells: Spell[]): void {
  const spellsById = Object.fromEntries(spells.map(spell => [spell.id, spell]));

  const artificierHtml = fs.readFileSync(path.resolve(__dirname, 'artificier.html'), {encoding: 'utf8'});

  const cheerioHtml = cheerio.load(artificierHtml);
  cheerioHtml('#liste tbody tr').each((_, row) => {
    const $row = cheerioHtml(row);

    const $link = $row.find('td.item a');
    const href = $link.attr('href') || '';
    const idMatch = href.match(/vf=([^&]+)/);

    const id = strSanitize(idMatch ? decodeURIComponent(idMatch[1]) : '');

    const spell = spellsById[id];
    if (!spell) {
      console.warn(`Spell ${id} not found in spells list`);
      return;
    }
    spell.classes.push('Artificier');
  });
}

function patchNonOgl(spells: Spell[]): void {
  const nonOglJson = fs.readFileSync(path.resolve(__dirname, 'non-ogl-vf.json'), {encoding: 'utf8'});
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const nonOgl: Record<string, string> = JSON.parse(nonOglJson);

  for (const spell of spells) {
    if (spell.id in nonOgl) {
      let replacement = nonOgl[spell.id];
      replacement = '<em>[Non OGL]</em><p>'
        + strSanitize(nonOgl[spell.id]).replace(/\n/g, '</p><p>')
        + '</p>';

      spell.details = spell.details.split('<p class="resume">Description non disponible (non OGL)')[0].trim();
      spell.details += `<div class="description">${replacement}</div>`;
    }
  }
}

function main(): void {
  const spells = parseIndexFile();
  spells.map(spell => addDetailsFile(spell));
  patchArtificier(spells);
  patchNonOgl(spells);

  console.log(spells[0]);

  // Generate TypeScript content
  let tsContent = `import {Spell} from './spell.model';

/* eslint-disable max-len */

export const spellsFr: Spell[] = [
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
  const outputPath = path.resolve(__dirname, '../../src/app/spells/spells-fr.ts');
  fs.writeFileSync(outputPath, tsContent, {encoding: 'utf8'});

  console.log(`spells-fr.ts successfully written to ${outputPath}`);
}

try {
  main();
  console.log('success');
  process.exit(0);
} catch (err) {
  console.error('failed', err);
  process.exit(1);
}
