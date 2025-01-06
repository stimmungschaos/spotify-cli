import { execSync } from 'child_process';

if (process.platform === 'win32') {
  // Windows portable package
  execSync('mkdir -p bin/spotify-cli-win');
  execSync('cp dist/index.js bin/spotify-cli-win/');
  execSync('echo @node "%~dp0index.js" %* > bin/spotify-cli-win/spotify-cli.cmd');
  // ZIP erstellen
  execSync('powershell Compress-Archive -Path bin/spotify-cli-win/* -DestinationPath spotify-cli-win.zip -Force');
} else {
  // Linux Build
  execSync('mkdir -p debian/DEBIAN debian/usr/bin');
  execSync('cp dist/* debian/usr/bin/');
  execSync('chmod +x debian/usr/bin/*');
  execSync('dpkg-deb --build debian');
  execSync('mv debian.deb spotify-cli_1.0.0_amd64.deb');
} 