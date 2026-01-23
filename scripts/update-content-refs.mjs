
import fs from 'fs/promises';
import { glob } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTENT_DIR = path.resolve(__dirname, '../content');

async function updateReferences() {
  console.log('Scanning for markdown files in:', CONTENT_DIR);
  const files = await glob('**/*.md', { cwd: CONTENT_DIR, absolute: true });

  console.log(`Found ${files.length} markdown files.`);

  let updatedCount = 0;

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    
    // Replace .png, .jpg, .jpeg with .webp
    // We look for these extensions followed by a quote, asking closing parenthesis, or end of line
    const regex = /(\.(png|jpg|jpeg))(["')\s]|$)/gi;
    
    if (regex.test(content)) {
      const newContent = content.replace(regex, '.webp$3');
      if (newContent !== content) {
        await fs.writeFile(file, newContent, 'utf8');
        console.log(`Updated: ${path.relative(CONTENT_DIR, file)}`);
        updatedCount++;
      }
    }
  }

  console.log(`Update complete. Modified ${updatedCount} files.`);
}

updateReferences().catch(err => console.error(err));
