import { chmodSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Plattformspezifische Berechtigungen setzen
if (process.platform !== 'win32') {
  chmodSync(join(__dirname, '../dist/index.js'), '755');
} 