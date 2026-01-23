
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '../public');

async function getFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  }));
  return Array.prototype.concat(...files);
}

async function convertImages() {
  console.log('Scanning for images in:', PUBLIC_DIR);
  const files = await getFiles(PUBLIC_DIR);
  
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.png', '.jpg', '.jpeg'].includes(ext);
  });

  console.log(`Found ${imageFiles.length} images to convert.`);

  let convertedCount = 0;
  let errorCount = 0;

  for (const file of imageFiles) {
    const ext = path.extname(file);
    const newFile = file.replace(new RegExp(`${ext}$`), '.webp');
    
    try {
      console.log(`Converting: ${path.relative(PUBLIC_DIR, file)} -> ${path.relative(PUBLIC_DIR, newFile)}`);
      
      await sharp(file)
        .webp({ quality: 80 })
        .toFile(newFile);
        
      convertedCount++;
      // Optional: Delete original file? User didn't explicitly say to delete, but typically "convert" implies replacing or at least using the new one. 
      // For safety, I'll keep originals for now until references are updated, or I can delete them in a cleanup step.
      // Actually, to make replacing references easier and avoid clutter, I might want to delete them later. 
      // But let's just create the .webp versions first.
      
    } catch (err) {
      console.error(`Error converting ${file}:`, err);
      errorCount++;
    }
  }

  console.log(`Conversion complete.`);
  console.log(`Converted: ${convertedCount}`);
  console.log(`Errors: ${errorCount}`);
}

convertImages().catch(err => console.error(err));
