import { NextRequest } from 'next/server';
import fs from 'fs';
import crypto from 'crypto';

// Generiere einen zufälligen Token für die Session
const generateSessionToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Speichere Token mit Session-ID
const saveTokenWithSession = (spotifyTokens: any) => {
  const sessionToken = generateSessionToken();
  const data = {
    sessionToken,
    spotifyTokens,
    timestamp: Date.now()
  };
  
  fs.writeFileSync('/tmp/.spotify-cli-tokens.json', JSON.stringify(data));
  return sessionToken;
};

export async function GET(request: NextRequest) {
  try {
    // Lese gespeicherte Tokens
    const data = JSON.parse(fs.readFileSync('/tmp/.spotify-cli-tokens.json', 'utf8'));
    
    // Überprüfe Timestamp (15 Minuten Gültigkeit)
    if (Date.now() - data.timestamp > 15 * 60 * 1000) {
      return new Response('Token expired', { status: 401 });
    }

    // Lösche Token-Datei nach erfolgreichem Abruf
    fs.unlinkSync('/tmp/.spotify-cli-tokens.json');
    
    return new Response(JSON.stringify(data.spotifyTokens), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Token-Fehler:', error);
    return new Response('Unauthorized', { status: 401 });
  }
} 