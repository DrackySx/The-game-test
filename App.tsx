import React, { useState, useEffect } from 'react';
import CharacterCreator from './components/CharacterCreator';
import ContentViewer from './components/ContentViewer';
import GameScreen from './components/GameScreen';
import CharacterSelect from './components/CharacterSelect';
import { Personagem } from './types';
import { getCharacters } from './game/storage';

type View = 'menu' | 'creator' | 'content' | 'game' | 'charSelect';

const App: React.FC = () => {
  const [view, setView] = useState<View>('menu');
  const [activeCharacter, setActiveCharacter] = useState<Personagem | null>(null);
  const [hasCharacters, setHasCharacters] = useState(false);

  useEffect(() => {
    setHasCharacters(getCharacters().length > 0);
  }, [view]);

  const handleCharacterSelect = (character: Personagem) => {
    setActiveCharacter(character);
    setView('game');
  };
  
  const handleCreationComplete = () => {
    setHasCharacters(true);
    setView('charSelect');
  }

  const handleExitGame = () => {
    setActiveCharacter(null);
    setView('charSelect');
  }

  const handleDownloadApk = () => {
    // Esta função simula o download de um arquivo APK.
    // Para uma aplicação real, você substituiria isso por um link direto para o seu arquivo APK hospedado.
    // Exemplo: const apkUrl = 'https://seusite.com/downloads/AventuraFantastica.apk';
    const apkContent = "Este é um placeholder para o arquivo APK de Aventura Fantástica. Substitua o link no código pelo APK real quando ele estiver hospedado.\n\n" +
                       "This is a placeholder for the Fantastic Adventure APK file. Replace the link in the code with the real APK when it is hosted.\n";
    const blob = new Blob([apkContent], { type: 'application/vnd.android.package-archive' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AventuraFantastica.apk';
    document.body.appendChild(a);
    a.click();
    
    // Limpeza: usa um timeout para garantir que o download inicie antes de revogar a URL
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
  };

  const renderView = () => {
    switch (view) {
      case 'creator':
        return <CharacterCreator onBack={() => setView('menu')} onFinish={handleCreationComplete} />;
      case 'content':
        return <ContentViewer onBack={() => setView('menu')} />;
      case 'game':
        if (activeCharacter) {
          return <GameScreen character={activeCharacter} onExit={handleExitGame} />;
        }
        // Fallback if no character is active
        setView('charSelect'); 
        return null;
      case 'charSelect':
        return <CharacterSelect onBack={() => setView('menu')} onSelectCharacter={handleCharacterSelect} onNewCharacter={() => setView('creator')}/>
      case 'menu':
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-center">
            <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url('https://picsum.photos/seed/fantasyworld/1200/800')"}}></div>
            <div className="relative z-10 bg-black bg-opacity-50 p-8 rounded-xl shadow-2xl border border-yellow-700">
              <h1 className="font-title text-6xl md:text-8xl text-yellow-400 mb-4 tracking-wider">Aventura Fantástica</h1>
              <p className="text-gray-300 text-lg md:text-xl mb-8">Sua jornada épica começa aqui.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MenuButton onClick={() => setView('creator')}>Criar Personagem</MenuButton>
                <MenuButton onClick={() => setView('charSelect')} disabled={!hasCharacters}>Jogar</MenuButton>
                <MenuButton onClick={() => setView('content')}>Conteúdo do Jogo</MenuButton>
              </div>

              <div className="rainbow-neon-box">
                <div className="bg-zinc-900 rounded-xl p-4">
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <a
                      href="."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center bg-transparent hover:bg-gray-800 text-cyan-300 font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105 border-2 border-cyan-500 hover:border-cyan-200 text-lg shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                    >
                      Abrir na Web
                    </a>
                    <NeonButton onClick={handleDownloadApk}>
                      Baixar APK
                    </NeonButton>
                  </div>
                </div>
              </div>

            </div>
          </div>
        );
    }
  };

  return <div className="min-h-screen bg-gray-800 text-gray-200">{renderView()}</div>;
};

interface MenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    onClick: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ children, onClick, ...props }) => (
    <button 
        onClick={onClick}
        className="w-full bg-yellow-600 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 border-2 border-yellow-700 hover:border-yellow-400 text-lg disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none disabled:border-gray-700"
        {...props}
    >
        {children}
    </button>
);

const NeonButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
    <button
        className="w-full bg-transparent hover:bg-gray-800 text-cyan-300 font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105 border-2 border-cyan-500 hover:border-cyan-200 text-lg shadow-[0_0_10px_rgba(0,255,255,0.5)]"
        {...props}
    >
        {children}
    </button>
);


export default App;