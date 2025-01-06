import { NextRequest } from 'next/server';
import SpotifyWebApi from 'spotify-web-api-node';
import fs from 'fs';
import path from 'path';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return new Response('No code provided', { status: 400 });
  }

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const tokens = {
      accessToken: data.body['access_token'],
      refreshToken: data.body['refresh_token']
    };

    // Tokens im /tmp Verzeichnis speichern
    const tmpPath = '/tmp/.spotify-cli-tokens.json';
    fs.writeFileSync(tmpPath, JSON.stringify(tokens, null, 2));
    console.log('Tokens im /tmp gespeichert:', tmpPath);

    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentifizierung erfolgreich</title>
        </head>
        <body>
          <h1>Authentifizierung erfolgreich!</h1>
          <p>Sie können diese Seite nun schließen.</p>
          <script>
            setTimeout(() => window.close(), 3000);
          </script>
        </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Auth Error:', error);
    return new Response('Authentication failed: ' + error.message, { status: 500 });
  }
} 