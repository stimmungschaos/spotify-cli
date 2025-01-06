export default function ErrorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-center mb-8">
              <svg className="w-12 h-12 text-red-500" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <h1 className="ml-4 text-2xl font-bold">Fehler</h1>
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold mb-2">Authentifizierung fehlgeschlagen</h2>
              <p className="text-gray-400">
                Bitte versuche es erneut oder kontaktiere den Support.
              </p>
            </div>

            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
              <p className="text-sm text-red-300">
                Kehre zur Terminal zurück und starte den Authentifizierungsprozess neu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 
