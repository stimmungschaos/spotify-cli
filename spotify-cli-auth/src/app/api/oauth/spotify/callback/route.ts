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

    // Tokens in der Home-Directory des Users speichern
    const tokenPath = path.join(process.env.HOME || process.env.USERPROFILE || '', '.spotify-cli-tokens.json');
    fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));

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
    return new Response('Authentication failed', { status: 500 });
  }
} 