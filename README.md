 - Spotify CLI
 - Ein  Command Line Interface für Spotify, zum steuern von Spotify vom Terminal aus


Features:
- Einfache Musiksteuerung (play, pause, next, previous)
- Gerätemanagement 
- Tracks liken/unliken
- Sichere Authentifizierung
- Designter Terminal Output

Installation:
- curl -o spotify-cli_1.0.0_amd64.deb https://github.com/stimmungschaos/spotify-cli/releases/download/v1/spotify-cli_1.0.0_amd64.deb
- sudo dpkg --force-depends -i spotify-cli_1.0.0_amd64.deb
- rm spotify-cli_1.0.0_amd64.deb

Oder Selber kompilieren: 
- git clone https://github.com/stimmungschaos/spotify-cli.git
- cd spotify-cli
- npm i
- ./build.sh 


 - Verwendung:
 - Erstelle eine .env Datei in dem Verzeichnis spotify-cli und spotify-cli-auth mit folgenden Werten:

- SPOTIFY_CLIENT_ID=CLIENT_ID
- SPOTIFY_CLIENT_SECRET=CLIENT_SECRET
- REDIRECT_URI=https://spotify-cli.chaosly.de/oauth/spotify/callback

- Davor musst du im Spotify Developer Dashboard eine App erstellen. 
 - Bei der REDIRECT_URI gibst du https://spotify-cli.chaosly.de/oauth/spotify/callback ein. Und unten bei  API's Used wählst du die Web API aus. 
 - Wenn erstellt, gehst du auf die Settings und kopierst Client ID und Secret. Diese Werte musst du in die .env Datei einfügen. 


- spotify-cli --help 
- zur Auflistung aller vorhandenen Befehle
- Commands ausprobieren, als Beispiel spotify-cli play
- Wenn nicht authentifiziert, wird ein Browser-Fenster zur Spotify-Authentifizierung geöffnet.
- Wenn die Authentifizierung erfolgreich ist, werden die Tokens gespeichert und man kann Anfangen die Befehle zu verwenden. 



