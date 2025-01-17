#!/bin/bash

# Cleanup
rm -rf dist debian spotify-cli_1.0.0_amd64.deb
sudo dpkg -r spotify-cli 

# Build
npm run build

# Create debian package structure
mkdir -p debian/DEBIAN debian/usr/bin

# Create wrapper script
cat > debian/usr/bin/spotify-cli << 'EOL'
#!/bin/bash
NODE_PATH=/usr/bin node --experimental-json-modules --no-deprecation /usr/bin/index.js "$@"
EOL
chmod +x debian/usr/bin/spotify-cli

# Create control file
cat > debian/DEBIAN/control << EOL
Package: spotify-cli
Version: 1.0.0
Section: utils
Priority: optional
Architecture: amd64
Maintainer: Linus <stimmungschaos@chaosly.de>
Description: Ein CLI-Tool für Spotify
 Ermöglicht die Steuerung von Spotify über die Kommandozeile
 mit Funktionen wie Play, Pause, Skip und mehr.


EOL

# Copy files
cp dist/* debian/usr/bin/
chmod +x debian/usr/bin/*

# Build debian package
dpkg-deb --build debian
mv debian.deb spotify-cli_1.0.0_amd64.deb

# Package Install

sudo dpkg --force-depends -i spotify-cli_1.0.0_amd64.deb 
echo "Build & Install  complete!" 
