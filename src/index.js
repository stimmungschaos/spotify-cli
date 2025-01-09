#!/usr/bin/env node

import { program } from 'commander';
import SpotifyWebApi from 'spotify-web-api-node';
import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import open from 'open';
import dotenv from 'dotenv';
import { createRequire } from 'module';
import chalk from 'chalk';
import boxen from 'boxen';
import Table from 'cli-table3';
import fetch from 'node-fetch';

const require = createRequire(import.meta.url);

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Token-Datei im Home-Verzeichnis
const TOKEN_PATH = path.join(
  process.env.APPDATA || process.env.HOME || process.env.USERPROFILE,
  '.spotify-cli-tokens.json'
);

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});

// Token-Management Funktionen
async function saveTokens(tokens) {
  try {
    debug('Versuche Tokens zu speichern...');
    debug('Token-Pfad: ' + TOKEN_PATH);
    
    // Stelle sicher, dass das Verzeichnis existiert
    const tokenDir = path.dirname(TOKEN_PATH);
    fs.mkdirSync(tokenDir, { recursive: true });
    
    // Setze Berechtigungen für die Datei
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2), {
      mode: 0o600  // Nur der Besitzer kann lesen und schreiben
    });
    
    debug('Tokens erfolgreich gespeichert');
    
    // Überprüfe, ob die Datei wirklich erstellt wurde
    const stats = fs.statSync(TOKEN_PATH);
    debug('Token-Datei erstellt mit Berechtigungen: ' + stats.mode.toString(8));
    
    return true;
  } catch (error) {
    console.error('Debug: Fehler beim Speichern der Tokens:', error);
    console.error('Debug: Stack:', error.stack);
    return false;
  }
}

async function loadTokens() {
  try {
    debug('Versuche Tokens zu laden...');
    debug('Token-Pfad: ' + TOKEN_PATH);
    
    // Prüfe ob die Datei existiert
    if (!fs.existsSync(TOKEN_PATH)) {
      debug('Token-Datei existiert nicht');
      return null;
    }
    
    const data = fs.readFileSync(TOKEN_PATH, 'utf8');
    debug('Tokens gefunden');
    return JSON.parse(data);
  } catch (error) {
    console.error('Debug: Fehler beim Laden der Tokens:', error);
    console.error('Debug: Stack:', error.stack);
    return null;
  }
}

async function refreshAccessToken() {
  try {
    console.log('Token abgelaufen, versuche zu erneuern...');
    const data = await spotifyApi.refreshAccessToken();
    const tokens = {
      accessToken: data.body['access_token'],
      refreshToken: spotifyApi.getRefreshToken()
    };
    
    // Speichere neue Tokens
    await saveTokens(tokens);
    
    // Setze neue Tokens
    spotifyApi.setAccessToken(tokens.accessToken);
    spotifyApi.setRefreshToken(tokens.refreshToken);
    
    return true;
  } catch (error) {
    console.error('Token-Erneuerung fehlgeschlagen:', error.message);
    // Lösche ungültige Tokens
    try {
      await fs.unlink(TOKEN_PATH);
    } catch (e) {
      // Ignoriere Fehler beim Löschen
    }
    return false;
  }
}

// Wrapper für API-Aufrufe mit automatischer Token-Erneuerung
async function withTokenRefresh(apiCall) {
  try {
    return await apiCall();
  } catch (error) {
    if (error.message === 'The access token expired') {
      if (await refreshAccessToken()) {
        // Versuche den API-Aufruf erneut
        return await apiCall();
      }
    }
    throw error;
  }
}

// Authentifizierungs-Funktion
async function authenticate() {
  debug('Starte Authentifizierung...');
  
  const tokens = await loadTokens();
  if (tokens) {
    debug('Bestehende Tokens gefunden');
    spotifyApi.setAccessToken(tokens.accessToken);
    spotifyApi.setRefreshToken(tokens.refreshToken);
    
    if (await refreshAccessToken()) {
      debug('Token erfolgreich erneuert');
      return;
    }
  }

  return new Promise((resolve, reject) => {
    const checkForTokens = async () => {
      try {
        debug('Prüfe auf neue Tokens...');
        const response = await fetch('https://spotify-cli.chaosly.de/api/oauth/spotify/tokens');
        
        if (!response.ok) {
          debug('Keine Tokens gefunden, warte...');
          setTimeout(checkForTokens, 1000);
          return;
        }
        
        debug('Tokens vom Server erhalten');
        const tokens = await response.json();
        
        debug('Speichere Tokens lokal...');
        await saveTokens(tokens);
        
        spotifyApi.setAccessToken(tokens.accessToken);
        spotifyApi.setRefreshToken(tokens.refreshToken);
        
        debug('Auth abgeschlossen');
        resolve();
      } catch (error) {
        debug('Fehler beim Token-Check: ' + error);
        setTimeout(checkForTokens, 1000);
      }
    };

    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('Auth läuft, bitte warten...');
    });

    server.listen(8022, async () => {
      debug('Server läuft auf Port 8022');
      const scopes = [
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing',
        'user-library-read',
        'user-library-modify',
        'playlist-read-private',
        'playlist-modify-public',
        'playlist-modify-private'
      ];
      
      spotifyApi.setRedirectURI(process.env.REDIRECT_URI);
      debug('Öffne Auth-URL...');
      const authorizeURL = spotifyApi.createAuthorizeURL(scopes, 'state');
      await open(authorizeURL);
      debug('Warte auf Tokens vom Server...');
      
      setTimeout(checkForTokens, 1000);
    });
  });
}

const formatOutput = (title, content) => {
  return boxen(chalk.bold(title) + '\n' + content, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'cyan'
  });
};

const formatError = (message) => {
  return boxen(chalk.red('Error: ') + message, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'red'
  });
};

// Config-Datei im Home-Verzeichnis
const CONFIG_PATH = path.join(
  process.env.APPDATA || process.env.HOME || process.env.USERPROFILE,
  '.spotify-cli-config.json'
);

// Debug-Funktion mit Cache
let configCache = null;
function debug(message) {
  if (configCache === null) {
    configCache = loadConfig();
  }
  if (configCache.debug) {
    console.log('Debug:', message);
  }
}

// Config-Management
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Fehler beim Laden der Config:', error);
  }
  return { debug: false };
}

function saveConfig(config) {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    return true;
  } catch (error) {
    console.error('Fehler beim Speichern der Config:', error);
    return false;
  }
}

// Config Command
program
  .command('config')
  .description('Konfiguration anzeigen oder ändern')
  .argument('<key>', 'Konfigurations-Schlüssel (z.B. debug)')
  .argument('[value]', 'Neuer Wert (on/off)')
  .action((key, value) => {
    const config = loadConfig();
    
    if (value === undefined) {
      // Wert anzeigen
      console.log(`${key}: ${config[key] ? 'on' : 'off'}`);
    } else {
      // Wert setzen
      config[key] = value === 'on';
      if (saveConfig(config)) {
        console.log(`${key} wurde auf ${value} gesetzt`);
      }
    }
  });

// Debug-Option für alle Commands
program.option('--debug', 'Debug-Modus aktivieren');

program
  .name('spotify-cli')
  .version('1.0.0')
  .description(chalk.cyan('Ein CLI-Tool für Spotify'))
  .usage(chalk.yellow('[command] [options]'));

program.on('--help', () => {
  console.log('');
  console.log('Beispiele:');
  console.log('  $ spotify-cli play              # Startet die Wiedergabe');
  console.log('  $ spotify-cli current           # Zeigt aktuellen Track');
  console.log('  $ spotify-cli search metallica  # Sucht nach Tracks');
  console.log('');
});

program
  .command('play')
  .description('Aktuelle Wiedergabe fortsetzen')
  .action(async (options) => {
    try {
      // Debug-Modus aus Command-Option oder Config
      const config = loadConfig();
      const debugMode = program.opts().debug || config.debug;
      
      if (debugMode) {
        console.log('Debug: Starte Authentifizierung...');
      }
      
      await authenticate();
      
      if (debugMode) {
        console.log('Debug: Authentifizierung erfolgreich');
      }
      
      await withTokenRefresh(() => spotifyApi.play());
      console.log(formatOutput('Wiedergabe', chalk.green('▶️ Wiedergabe gestartet')));
    } catch (error) {
      console.error(formatError(error.message));
    }
  });

program
  .command('pause')
  .description('Aktuelle Wiedergabe pausieren')
  .action(async () => {
    try {
      await authenticate();
      await spotifyApi.pause();
      console.log('⏸️ Wiedergabe pausiert');
    } catch (error) {
      console.error('Fehler:', error.message);
    }
  });

program
  .command('next')
  .aliases(['skip', 'n'])
  .description('Nächster Track')
  .action(async () => {
    try {
      await authenticate();
      await spotifyApi.skipToNext();
      console.log('⏭️ Nächster Track');
    } catch (error) {
      console.error('Fehler:', error.message);
    }
  });

program
  .command('prev')
  .aliases(['previous', 'b', 'back'])
  .description('Vorheriger Track')
  .action(async () => {
    try {
      await authenticate();
      await spotifyApi.skipToPrevious();
      console.log('⏮️ Vorheriger Track');
    } catch (error) {
      console.error('Fehler:', error.message);
    }
  });

program
  .command('volume <level>')
  .description('Lautstärke einstellen (0-100)')
  .action(async (level) => {
    try {
      await authenticate();
      const volume = Math.min(Math.max(parseInt(level), 0), 100);
      await spotifyApi.setVolume(volume);
      console.log(`🔊 Lautstärke auf ${volume}% gesetzt`);
    } catch (error) {
      console.error('Fehler:', error.message);
    }
  });

program
  .command('current')
  .aliases(['now', 'playing'])
  .description('Aktuellen Track anzeigen')
  .action(async () => {
    try {
      await authenticate();
      const data = await spotifyApi.getMyCurrentPlayingTrack();
      if (data.body && data.body.item) {
        const track = data.body.item;
        const artists = track.artists.map(artist => artist.name).join(', ');
        console.log(formatOutput('Aktueller Track', `
${chalk.green('🎵 Titel:')} ${chalk.bold(track.name)}
${chalk.blue('👤 Künstler:')} ${artists}
${chalk.yellow('💿 Album:')} ${track.album.name}
${chalk.gray('🔗 Link:')} ${track.external_urls.spotify}`));
      } else {
        console.log(formatOutput('Status', chalk.yellow('❌ Kein Track wird derzeit abgespielt')));
      }
    } catch (error) {
      console.error(formatError(error.message));
    }
  });

program
  .command('shuffle')
  .description('Zufallswiedergabe umschalten')
  .action(async () => {
    try {
      await authenticate();
      const state = await spotifyApi.getMyCurrentPlaybackState();
      const newState = !state.body.shuffle_state;
      await spotifyApi.setShuffle(newState);
      console.log(`🔀 Zufallswiedergabe ${newState ? 'aktiviert' : 'deaktiviert'}`);
    } catch (error) {
      console.error('Fehler:', error.message);
    }
  });

program
  .command('repeat')
  .description('Wiederholungsmodus umschalten (track/context/off)')
  .argument('[mode]', 'Wiederholungsmodus (track/context/off)', 'context')
  .action(async (mode) => {
    try {
      await authenticate();
      await spotifyApi.setRepeat(mode);
      console.log(`🔁 Wiederholung: ${mode}`);
    } catch (error) {
      console.error('Fehler:', error.message);
    }
  });

program
  .command('search [words...]')
  .description('Nach Tracks suchen')
  .option('-l, --limit <number>', 'Anzahl der Ergebnisse', '5')
  .action(async (words, options) => {
    try {
      await authenticate();
      const query = words.join(' ');
      const data = await spotifyApi.searchTracks(query, { limit: options.limit });
      if (data.body.tracks.items.length > 0) {
        const table = new Table({
          head: [
            chalk.cyan('#'),
            chalk.cyan('Track'),
            chalk.cyan('Künstler'),
            chalk.cyan('Album'),
            chalk.cyan('URI')
          ],
          style: {
            head: [],
            border: []
          },
          wordWrap: true,
          wrapOnWordBoundary: true
        });

        data.body.tracks.items.forEach((track, index) => {
          table.push([
            chalk.gray(index + 1),
            chalk.bold(track.name),
            track.artists.map(artist => artist.name).join(', '),
            track.album.name,
            chalk.gray(track.uri)
          ]);
        });

        console.log(formatOutput('Suchergebnisse', 
          table.toString() + '\n\n' + 
          chalk.italic('Tipp: Nutze "spotify-cli queue <uri>" um einen Track zur Warteschlange hinzuzufügen')
        ));
      } else {
        console.log(formatOutput('Suche', chalk.yellow('❌ Keine Tracks gefunden')));
      }
    } catch (error) {
      console.error(formatError(error.message));
    }
  });

program
  .command('queue <uri>')
  .description('Track zur Warteschlange hinzufügen')
  .action(async (uri) => {
    try {
      await authenticate();
      await spotifyApi.addToQueue(uri);
      console.log('➕ Track zur Warteschlange hinzugefügt');
    } catch (error) {
      console.error('Fehler:', error.message);
    }
  });

program
  .command('devices')
  .description('Verfügbare Geräte anzeigen')
  .action(async () => {
    try {
      await authenticate();
      const data = await spotifyApi.getMyDevices();
      if (data.body.devices.length > 0) {
        const table = new Table({
          head: [
            chalk.cyan('Status'),
            chalk.cyan('Name'),
            chalk.cyan('Typ'),
            chalk.cyan('Lautstärke'),
            chalk.cyan('ID')
          ],
          style: {
            head: [],
            border: []
          }
        });

        data.body.devices.forEach(device => {
          table.push([
            device.is_active ? chalk.green('▶️') : chalk.gray('⭕'),
            chalk.bold(device.name),
            device.type,
            `${device.volume_percent}%`,
            chalk.gray(device.id)
          ]);
        });

        console.log(formatOutput('Verfügbare Geräte', table.toString()));
      } else {
        console.log(formatOutput('Geräte', chalk.yellow('❌ Keine Geräte gefunden')));
      }
    } catch (error) {
      console.error(formatError(error.message));
    }
  });

program
  .command('transfer <deviceId>')
  .description('Wiedergabe auf anderes Gerät übertragen')
  .action(async (deviceId) => {
    try {
      await authenticate();
      await spotifyApi.transferMyPlayback([deviceId]);
      console.log('📱 Wiedergabe übertragen');
    } catch (error) {
      console.error('Fehler:', error.message);
    }
  });

program
  .command('like')
  .description('Aktuellen Track liken/unliken')
  .action(async () => {
    try {
      await authenticate();
      const track = await spotifyApi.getMyCurrentPlayingTrack();
      if (track.body && track.body.item) {
        const id = track.body.item.id;
        const isSaved = await spotifyApi.containsMySavedTracks([id]);
        if (isSaved.body[0]) {
          await spotifyApi.removeFromMySavedTracks([id]);
          console.log('💔 Track aus deinen Likes entfernt');
        } else {
          await spotifyApi.addToMySavedTracks([id]);
          console.log('❤️ Track zu deinen Likes hinzugefügt');
        }
      }
    } catch (error) {
      console.error('Fehler:', error.message);
    }
  });

program.parse(process.argv); 
