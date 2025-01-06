import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Spotify CLI',
  description: 'Steuere Spotify direkt aus deinem Terminal',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-green-900 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
      <div className="absolute top-0 -left-4 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header with animated gradient */}
          <div className="text-center mb-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 blur-3xl transform -skew-y-6"></div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent relative">
              Spotify CLI
            </h1>
            <p className="text-2xl text-gray-300 font-light">
              Dein Terminal. <span className="text-green-400">Deine Musik.</span> Volle Kontrolle.
            </p>
          </div>

          {/* Command Demo with terminal styling */}
          <div className="bg-gray-900/80 rounded-xl p-6 mb-16 backdrop-blur-md border border-gray-700/50 shadow-2xl transform hover:scale-[1.02] transition-all">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-700/50 pb-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="font-mono text-sm space-y-2">
              <div className="text-gray-400 flex items-center gap-2">
                <span className="text-green-400">➜</span> spotify-cli --help
              </div>
              <div className="text-green-400 mt-4">Available Commands:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-4">
                {[
                  ['play', 'Wiedergabe starten'],
                  ['pause', 'Wiedergabe pausieren'],
                  ['next', 'Nächster Track'],
                  ['prev', 'Vorheriger Track'],
                  ['search', 'Nach Tracks suchen'],
                  ['like', 'Track liken/unliken']
                ].map(([cmd, desc]) => (
                  <div key={cmd} className="text-gray-300 flex items-center gap-2 group">
                    <span className="text-green-400 group-hover:text-green-300 transition-colors">{cmd}</span>
                    <span className="text-gray-500"># {desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features with hover effects */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: 'Einfache Bedienung',
                desc: 'Intuitive Befehle für maximale Produktivität',
                icon: '⌨️'
              },
              {
                title: 'Sichere Auth',
                desc: 'OAuth 2.0 für sicheren Zugriff auf dein Konto',
                icon: '🔐'
              },
              {
                title: 'Volle Kontrolle',
                desc: 'Alle wichtigen Spotify-Funktionen im Terminal',
                icon: '🎮'
              }
            ].map(({ title, desc, icon }) => (
              <div key={title} className="group">
                <div className="bg-gray-900/50 rounded-xl p-8 backdrop-blur-md border border-gray-800 shadow-xl 
                               transform hover:-translate-y-1 transition-all duration-300
                               hover:border-green-500/30 hover:bg-gray-900/80">
                  <div className="text-2xl mb-4 transform group-hover:scale-110 transition-transform">{icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-green-400 group-hover:text-green-300">{title}</h3>
                  <p className="text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Installation with code highlighting */}
          <div className="bg-gray-900/80 rounded-xl p-8 backdrop-blur-md border border-gray-800 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-green-400 flex items-center gap-3">
              <span>Installation</span>
              <div className="h-px flex-1 bg-gradient-to-r from-green-500/50 to-transparent"></div>
            </h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="text-gray-400 font-semibold">Linux/Ubuntu</div>
                <div className="bg-black/50 p-4 rounded-lg font-mono text-sm relative group">
                  <div className="absolute inset-0 bg-green-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="text-green-400">$ wget https://github.com/stimmungschaos/spotify-cli/releases/latest/download/spotify-cli_1.0.0_amd64.deb</div>
                  <div className="text-green-400">$ sudo dpkg -i spotify-cli_1.0.0_amd64.deb</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-gray-400 font-semibold">Windows</div>
                <div className="bg-black/50 p-4 rounded-lg font-mono text-sm relative group">
                  <div className="absolute inset-0 bg-green-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="text-green-400">1. Download spotify-cli-windows.zip</div>
                  <div className="text-green-400">2. Extract and run install.bat</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with gradient line */}
          <div className="text-center mt-16 text-gray-400">
            <div className="h-px w-32 mx-auto mb-8 bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
            <p>
              Entwickelt von{' '}
              <a href="https://github.com/stimmungschaos" 
                 className="text-green-400 hover:text-green-300 transition-colors relative inline-block group">
                Chaosly
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500/50 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
} 
