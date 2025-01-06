'use client';
import { Metadata } from 'next';
import { useState, useEffect } from 'react';

const linuxCommands = [
  { cmd: 'wget https://github.com/stimmungschaos/spotify-cli/releases/latest/download/spotify-cli_1.0.0_amd64.deb', delay: 50 },
  { cmd: 'sudo dpkg -i --force-depends  spotify-cli_1.0.0_amd64.deb', delay: 30 },
];

const windowsCommands = [
  { cmd: 'wget https://github.com/stimmungschaos/spotify-cli/releases/latest/download/spotify-cli-windows.3.zip', delay: 50 },
  { cmd: 'Expand-Archive spotify-cli-windows.3.zip -DestinationPath .\\spotify-cli', delay: 30 },
  { cmd: '.\\spotify-cli\\install.bat', delay: 30 },
];

const features = [
  {
    title: 'Einfache Bedienung',
    desc: 'Intuitive Befehle und blitzschnelle Kontrolle über deine Musik',
    icon: '⌨️'
  },
  {
    title: 'Sichere Auth',
    desc: 'Modernste OAuth 2.0 Authentifizierung für maximale Sicherheit',
    icon: '🔐'
  },
  {
    title: 'Volle Kontrolle',
    desc: 'Wiedergabe, Suche, Playlists und mehr direkt im Terminal',
    icon: '🎮'
  }
];

const commandPreviews = [
  { cmd: 'spotify-cli play', output: '▶️ Now Playing: Current Track' },
  { cmd: 'spotify-cli next', output: '⏭️ Skipped to next track' },
  { cmd: 'spotify-cli like', output: '❤️ Added to your Liked Songs' },
  { cmd: 'spotify-cli search metallica', output: '🔍 Top Results:\n1. Enter Sandman\n2. Nothing Else Matters' }
];

const useCases = [
  {
    title: 'Produktivität',
    description: 'Steuere deine Musik ohne den Workflow zu unterbrechen',
    icon: '⚡'
  },
  {
    title: 'Terminal-Native',
    description: 'Perfekt integriert in deine Entwicklungsumgebung',
    icon: '💻'
  },
  {
    title: 'Schnell & Effizient',
    description: 'Blitzschnelle Kontrolle über deine Musikwiedergabe',
    icon: '🚀'
  }
];

export default function Home() {
  const [platform, setPlatform] = useState('linux');
  const commands = platform === 'linux' ? linuxCommands : windowsCommands;
  const [typedCommands, setTypedCommands] = useState(['', '']);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [copied, setCopied] = useState<boolean[]>([false, false]);
  const [selectedPreview, setSelectedPreview] = useState(0);

  useEffect(() => {
    const isWindows = navigator.platform.includes('Win');
    setPlatform(isWindows ? 'windows' : 'linux');
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedPreview(prev => (prev + 1) % commandPreviews.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentLine >= commands.length) return;
    if (currentChar >= commands[currentLine].cmd.length) {
      if (currentLine < commands.length - 1) {
        const timer = setTimeout(() => {
          setCurrentLine(prev => prev + 1);
          setCurrentChar(0);
        }, 500);
        return () => clearTimeout(timer);
      }
      return;
    }

    const timer = setTimeout(() => {
      setTypedCommands(prev => {
        const newCommands = [...prev];
        newCommands[currentLine] = commands[currentLine].cmd.slice(0, currentChar + 1);
        return newCommands;
      });
      setCurrentChar(prev => prev + 1);
    }, commands[currentLine].delay);

    return () => clearTimeout(timer);
  }, [currentLine, currentChar]);

  const handleCopy = (index: number) => {
    navigator.clipboard.writeText(commands[index].cmd);
    setCopied(prev => {
      const newCopied = [...prev];
      newCopied[index] = true;
      setTimeout(() => {
        setCopied(prev => {
          const reset = [...prev];
          reset[index] = false;
          return reset;
        });
      }, 2000);
      return newCopied;
    });
  };

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
            <p className="mt-4 text-gray-400">
              Version 1.0.0 • Open Source • MIT License
            </p>
          </div>

          {/* Terminal Demo */}
          <div className="bg-gray-900/80 rounded-xl overflow-hidden backdrop-blur-md border border-gray-700/50 shadow-2xl mb-16">
            {/* Terminal Header */}
            <div className="bg-gray-800 p-4 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 text-center text-sm text-gray-400">
                <div className="flex justify-center gap-8">
                  <button 
                    onClick={() => {
                      setPlatform('linux');
                      setTypedCommands(Array(linuxCommands.length).fill(''));
                      setCurrentLine(0);
                      setCurrentChar(0);
                    }}
                    className={`px-3 py-1 rounded transition-colors ${
                      platform === 'linux' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'hover:bg-gray-700/50'
                    }`}
                  >
                    Linux
                  </button>
                  <span className="text-gray-600">|</span>
                  <button 
                    onClick={() => {
                      setPlatform('windows');
                      setTypedCommands(Array(windowsCommands.length).fill(''));
                      setCurrentLine(0);
                      setCurrentChar(0);
                    }}
                    className={`px-3 py-1 rounded transition-colors ${
                      platform === 'windows' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'hover:bg-gray-700/50'
                    }`}
                  >
                    Windows
                  </button>
                </div>
              </div>
            </div>

            {/* Terminal Content */}
            <div className="p-6 font-mono text-sm space-y-4">
              <div className="text-gray-400 mb-4">
                {platform === 'linux' ? '# Ubuntu/Debian Linux' : '# Windows PowerShell als Administrator'}
              </div>
              {typedCommands.map((cmd, index) => (
                <div key={index} className="flex items-start group">
                  <div className="flex-none text-green-400 mr-2">
                    {platform === 'linux' ? '$' : '>'}
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-300">{cmd}</span>
                    {currentLine === index && currentChar < commands[index].cmd.length && (
                      <span className="animate-pulse">▋</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleCopy(index)}
                    className={`ml-4 px-2 py-1 rounded text-xs transition-all duration-200 flex items-center gap-2 ${
                      copied[index]
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-700/50 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-700'
                    }`}
                  >
                    {copied[index] ? (
                      <>
                        <svg className="w-4 h-4 animate-checkmark" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Kopiert</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2"/>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeWidth="2"/>
                        </svg>
                        <span>Kopieren</span>
                      </>
                    )}
                  </button>
                </div>
              ))}

              {/* Neue Hinweise */}
              <div className="mt-8 text-sm">
                <div className="flex items-start gap-2 text-yellow-400/80">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="space-y-2">
                    <p>
                      {platform === 'windows' 
                        ? 'Bitte führen Sie die Installation in einer PowerShell mit Administratorrechten aus.'
                        : 'Für die Installation werden Administratorrechte benötigt.'}
                    </p>
                    <p>
                      Danach findest du unter folgendem Link  die weiteren Schritte:{' '}
                      <a 
                        href="https://github.com/stimmungschaos/spotify-cli#readme" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 underline"
                      >
                        README.md
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Command Preview Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">Live Demo</h2>
            <div className="bg-gray-900/80 rounded-xl overflow-hidden backdrop-blur-md border border-gray-700/50 shadow-2xl">
              <div className="p-6 font-mono text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">$</span>
                  <span className="text-gray-300">{commandPreviews[selectedPreview].cmd}</span>
                </div>
                <div className="mt-2 text-gray-400 whitespace-pre-line">
                  {commandPreviews[selectedPreview].output}
                </div>
              </div>
            </div>
          </div>

          {/* Use Cases Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">Anwendungsfälle</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {useCases.map(({ title, description, icon }) => (
                <div key={title} className="group">
                  <div className="bg-gray-900/50 rounded-xl p-8 backdrop-blur-md border border-gray-800 shadow-xl 
                                 transform hover:-translate-y-1 transition-all duration-300
                                 hover:border-green-500/30 hover:bg-gray-900/80">
                    <div className="text-3xl mb-4 transform group-hover:scale-110 transition-transform">{icon}</div>
                    <h3 className="text-xl font-semibold mb-2 text-green-400 group-hover:text-green-300">{title}</h3>
                    <p className="text-gray-400">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Copy All Button */}
          <div className="text-center mb-16">
            <button
              onClick={() => {
                const allCommands = commands.map(cmd => cmd.cmd).join('\n');
                navigator.clipboard.writeText(allCommands);
                // Feedback hinzufügen
                const button = document.getElementById('copy-all-button');
                if (button) {
                  button.classList.add('bg-green-500/40');
                  button.innerHTML = `
                    <svg class="w-5 h-5 animate-checkmark" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Befehle kopiert!
                  `;
                  setTimeout(() => {
                    button.classList.remove('bg-green-500/40');
                    button.innerHTML = `
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                      </svg>
                      Alle Befehle kopieren
                    `;
                  }, 2000);
                }
              }}
              id="copy-all-button"
              className="px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Alle Befehle kopieren
            </button>
          </div>

          {/* Features Grid mit verbesserten Beschreibungen */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map(({ title, desc, icon }) => (
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

          {/* Footer mit zusätzlichen Links */}
          <div className="text-center mt-16 text-gray-400">
            <div className="h-px w-32 mx-auto mb-8 bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
            <div className="space-y-6">
              <p>
                Entwickelt von{' '}
                <a href="https://github.com/stimmungschaos" 
                   className="text-green-400 hover:text-green-300 transition-colors relative inline-block group">
                  Chaosly
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500/50 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                </a>
              </p>
              <div className="flex justify-center gap-8 text-sm">
                <a href="https://github.com/stimmungschaos/spotify-cli/issues" 
                   className="text-gray-400 hover:text-green-400 transition-colors">
                  Bug melden
                </a>
                <a href="https://github.com/stimmungschaos/spotify-cli/blob/main/LICENSE" 
                   className="text-gray-400 hover:text-green-400 transition-colors">
                  Lizenz
                </a>
                <a href="https://github.com/stimmungschaos/spotify-cli" 
                   className="text-gray-400 hover:text-green-400 transition-colors">
                  GitHub
                </a>
              </div>

              {/* Suggestions Box */}
              <div className="max-w-lg mx-auto bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-gray-700/50">
                <h3 className="text-green-400 font-semibold mb-2">Verbesserungsvorschläge?</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Dein Feedback ist willkommen! Erstelle einen Pull Request oder öffne ein Issue auf GitHub.
                </p>
                <div className="flex justify-center gap-4">
                  <a
                    href="https://github.com/stimmungschaos/spotify-cli/pulls"
                    className="px-4 py-2 bg-gray-700/50 hover:bg-green-500/20 text-gray-300 hover:text-green-400 rounded transition-all duration-200 text-sm flex items-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Pull Request
                  </a>
                  <a
                    href="https://github.com/stimmungschaos/spotify-cli/issues/new"
                    className="px-4 py-2 bg-gray-700/50 hover:bg-green-500/20 text-gray-300 hover:text-green-400 rounded transition-all duration-200 text-sm flex items-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Feature Request
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 
