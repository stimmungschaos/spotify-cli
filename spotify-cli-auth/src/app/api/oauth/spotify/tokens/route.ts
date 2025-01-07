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

export async function POST(request: NextRequest) {
  try {
    const { sessionToken } = await request.json();
    
    // Lese gespeicherte Tokens
    const data = JSON.parse(fs.readFileSync('/tmp/.spotify-cli-tokens.json', 'utf8'));
    
    // Überprüfe Session-Token und Timestamp (15 Minuten Gültigkeit)
    if (data.sessionToken !== sessionToken || 
        Date.now() - data.timestamp > 15 * 60 * 1000) {
      return new Response('Unauthorized', { status: 401 });
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