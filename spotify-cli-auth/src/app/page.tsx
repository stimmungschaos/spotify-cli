import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Spotify CLI Auth',
  description: 'Authentifizierung für Spotify CLI',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Spotify CLI Auth</h1>
            <p className="text-xl text-gray-400">Eine elegante Lösung für Spotify CLI-Authentifizierung</p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gray-800/50 rounded-xl p-6">
              <div className="text-green-500 text-2xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold mb-2">Sichere Authentifizierung</h3>
              <p className="text-gray-400">OAuth 2.0 Flow mit sicherer Token-Verwaltung</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6">
              <div className="text-green-500 text-2xl mb-4">⚡️</div>
              <h3 className="text-xl font-semibold mb-2">Schnelle Integration</h3>
              <p className="text-gray-400">Nahtlose Verbindung mit der Spotify API</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6">
              <div className="text-green-500 text-2xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold mb-2">Volle Kontrolle</h3>
              <p className="text-gray-400">Steuere Spotify direkt aus deinem Terminal</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6">
              <div className="text-green-500 text-2xl mb-4">🛠</div>
              <h3 className="text-xl font-semibold mb-2">Entwicklerfreundlich</h3>
              <p className="text-gray-400">Einfache API und umfangreiche Dokumentation</p>
            </div>
          </div>

          {/* CLI Demo */}
          <div className="bg-gray-800 rounded-xl p-6 mb-16">
            <div className="font-mono text-sm">
              <div className="text-gray-400 mb-2">$ spotify-cli --help</div>
              <div className="text-green-400 mb-1">Commands:</div>
              <div className="text-gray-300 ml-2">play    # Startet die Wiedergabe</div>
              <div className="text-gray-300 ml-2">pause   # Pausiert die Wiedergabe</div>
              <div className="text-gray-300 ml-2">next    # Nächster Track</div>
              <div className="text-gray-300 ml-2">prev    # Vorheriger Track</div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-400 text-sm">
            <p>Entwickelt mit ❤️ von Chaosly</p>
          </div>
        </div>
      </div>
    </main>
  )
} 
