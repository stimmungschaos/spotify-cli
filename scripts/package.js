import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

if (process.platform === 'win32') {
  // Windows-spezifische Befehle
  execSync('if not exist bin\\spotify-cli-win mkdir bin\\spotify-cli-win');
  fs.copyFileSync('dist/index.js', 'bin/spotify-cli-win/index.js');
  fs.writeFileSync('bin/spotify-cli-win/spotify-cli.cmd', '@node "%~dp0index.js" %*');
  execSync('powershell Compress-Archive -Force -Path ".\\bin\\spotify-cli-win\\*" -DestinationPath ".\\spotify-cli-win.zip"');
} else {
  // Linux Build
  execSync('mkdir -p debian/DEBIAN debian/usr/bin');
  execSync('cp dist/* debian/usr/bin/');
  execSync('chmod +x debian/usr/bin/*');
  execSync('dpkg-deb --build debian');
  execSync('mv debian.deb spotify-cli_1.0.0_amd64.deb');
} 