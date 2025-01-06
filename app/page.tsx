import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Spotify CLI Auth',
  description: 'Authentifizierung für Spotify CLI',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-center mb-8">
              <svg className="w-12 h-12 text-green-500" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.371-.721.53-1.07.29-3.29-2.02-7.43-2.47-12.31-1.35-.47.11-.95-.16-1.06-.63-.11-.47.16-.95.63-1.06 5.42-1.23 10.04-.71 13.73 1.61.35.21.49.72.29 1.07zm1.47-3.27c-.3.45-.84.65-1.29.35-3.76-2.32-9.51-2.99-13.97-1.64-.58.18-1.19-.15-1.37-.73-.18-.58.15-1.19.73-1.37 5.1-1.55 11.45-.78 15.77 1.82.45.3.65.84.35 1.29zm.13-3.4C15.23 8.34 8.85 8.13 5.16 9.25c-.69.21-1.42-.17-1.63-.86-.21-.69.17-1.42.86-1.63 4.26-1.29 11.33-1.04 15.81 1.61.54.32.72 1.02.4 1.56-.32.54-1.02.72-1.56.4z"/>
              </svg>
              <h1 className="ml-4 text-2xl font-bold">Spotify CLI</h1>
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold mb-2">Authentifizierung erfolgreich!</h2>
              <p className="text-gray-400">
                Du kannst dieses Fenster jetzt schließen und zur CLI zurückkehren.
              </p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                <p className="text-sm text-gray-300">Verbindung hergestellt</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Nächste Schritte:</h3>
                <ul className="text-sm text-gray-400 list-disc list-inside space-y-2">
                  <li>Kehre zur Terminal zurück</li>
                  <li>Nutze <code className="bg-gray-600 px-2 py-1 rounded">spotify-cli --help</code> für eine Übersicht aller Befehle</li>
                  <li>Starte mit <code className="bg-gray-600 px-2 py-1 rounded">spotify-cli current</code> um den aktuellen Track anzuzeigen</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 