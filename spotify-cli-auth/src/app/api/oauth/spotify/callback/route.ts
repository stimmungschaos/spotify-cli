import { NextRequest } from 'next/server';
import SpotifyWebApi from 'spotify-web-api-node';

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

    // Hier können wir die Tokens speichern oder an das CLI weiterleiten
    
    // Redirect zur Erfolgsseite
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/',
      },
    });
  } catch (error) {
    console.error('Auth Error:', error);
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/error',
      },
    });
  }
} 