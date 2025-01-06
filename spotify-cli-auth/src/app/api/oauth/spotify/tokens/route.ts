import { NextRequest } from 'next/server';
import fs from 'fs';

export async function GET(request: NextRequest) {
  console.log('=== TOKEN ENDPOINT DEBUG ===');
  console.log('1. Token-Anfrage erhalten');
  
  try {
    const tokens = fs.readFileSync('/tmp/.spotify-cli-tokens.json', 'utf8');
    console.log('2. Tokens gefunden und werden gesendet');
    return new Response(tokens, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('3. Fehler beim Lesen der Tokens:', error);
    return new Response('No tokens found', { status: 404 });
  }
} 