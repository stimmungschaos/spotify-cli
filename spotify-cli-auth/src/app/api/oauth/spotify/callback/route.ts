import { NextRequest } from 'next/server';
import SpotifyWebApi from 'spotify-web-api-node';
import fs from 'fs';
import crypto from 'crypto';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});

// Generiere Session-Token
const generateSessionToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

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

    // Generiere und speichere Session-Token
    const sessionToken = generateSessionToken();
    const tokenData = {
      sessionToken,
      spotifyTokens: tokens,
      timestamp: Date.now()
    };

    fs.writeFileSync('/tmp/.spotify-cli-tokens.json', JSON.stringify(tokenData));

    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Spotify CLI Auth</title>
          <meta charset="UTF-8">
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
        </head>
        <body class="bg-gradient-to-br from-gray-900 to-black min-h-screen flex items-center justify-center p-4">
          <div class="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl p-8 text-center">
            <div class="flex justify-center mb-6">
              <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h1 class="text-2xl font-bold text-white mb-2">Authentifizierung erfolgreich!</h1>
            <p class="text-gray-400 mb-8">Die Tokens wurden erfolgreich gespeichert.</p>
            
            <div class="bg-gray-700/50 rounded-lg p-4 mb-6">
              <div class="flex items-center justify-center">
                <div class="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <p class="text-sm text-gray-300">Verbindung hergestellt</p>
              </div>
            </div>

            <div class="text-sm text-gray-400">
              Sie können diese Seite nun schließen und zum Terminal zurückkehren.
            </div>
          </div>

          <script>
            // Übergebe Session-Token an CLI
            window.opener.postMessage({ 
              type: 'SPOTIFY_AUTH_SUCCESS',
              sessionToken: '${sessionToken}'
            }, '*');
            setTimeout(() => window.close(), 3000);
          </script>
        </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      },
    });
  } catch (error) {
    console.error('Auth Error:', error);
    return new Response('Authentication failed: ' + error.message, { status: 500 });
  }
} 