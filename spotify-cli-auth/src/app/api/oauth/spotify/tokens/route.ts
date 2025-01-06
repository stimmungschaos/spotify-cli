import { NextRequest } from 'next/server';
import fs from 'fs';

export async function GET(request: NextRequest) {
  try {
    const tokens = fs.readFileSync('/tmp/.spotify-cli-tokens.json', 'utf8');
    return new Response(tokens, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response('No tokens found', { status: 404 });
  }
} 