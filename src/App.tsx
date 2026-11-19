import React, { useState } from 'react';
import { GameRulesConfig } from './engine/gameRulesConfig';
import { SettingsProvider } from './state/settingsContext';
import { GameScreen } from './ui/screens/GameScreen';
import { MainMenuScreen } from './ui/screens/MainMenuScreen';
import { ModeSelectionScreen } from './ui/screens/ModeSelectionScreen';
import { SettingsScreen } from './ui/screens/SettingsScreen';
import { TablePreviewScreen } from './ui/screens/TablePreviewScreen';
import { TileGalleryScreen } from './ui/screens/TileGalleryScreen';

type Route =
  | { name: 'menu' }
  | { name: 'modeSelection' }
  | { name: 'settings' }
  | { name: 'game'; playerCount: 2 | 4; rules: GameRulesConfig }
  | { name: 'gallery' }
  | { name: 'tablePreview' };

export const App: React.FC = () => {
  const [route, setRoute] = useState<Route>({ name: 'menu' });

  return (
    <SettingsProvider>
      <div className="w-full h-dvh overflow-hidden bg-[#2B1B12] text-[#F5EFE0]">
        {route.name === 'menu' && (
          <MainMenuScreen
            onPlay={() => setRoute({ name: 'modeSelection' })}
            onSettings={() => setRoute({ name: 'settings' })}
            onOpenGallery={() => setRoute({ name: 'gallery' })}
            onOpenTablePreview={() => setRoute({ name: 'tablePreview' })}
          />
        )}
        {route.name === 'modeSelection' && (
          <ModeSelectionScreen
            onBack={() => setRoute({ name: 'menu' })}
            onStartGame={(playerCount, rules) =>
              setRoute({ name: 'game', playerCount, rules })
            }
          />
        )}
        {route.name === 'settings' && (
          <SettingsScreen onBack={() => setRoute({ name: 'menu' })} />
        )}
        {route.name === 'game' && (
          <GameScreen
            playerCount={route.playerCount}
            rules={route.rules}
            onBack={() => setRoute({ name: 'modeSelection' })}
          />
        )}
        {route.name === 'gallery' && (
          <TileGalleryScreen onBack={() => setRoute({ name: 'menu' })} />
        )}
        {route.name === 'tablePreview' && (
          <TablePreviewScreen onBack={() => setRoute({ name: 'menu' })} />
        )}
      </div>
    </SettingsProvider>
  );
};

export default App;
