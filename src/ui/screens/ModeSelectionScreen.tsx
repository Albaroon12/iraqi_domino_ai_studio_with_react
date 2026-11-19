import React from 'react';
import { Lock, User, Users } from 'lucide-react';
import { defaultGameRulesConfig, GameRulesConfig } from '../../engine/gameRulesConfig';
import { WoodTable } from '../../rendering/WoodTable';
import { useSettings } from '../../state/settingsContext';
import { AppHeader } from '../widgets/AppHeader';
import { GameButton } from '../widgets/GameButton';

export interface ModeSelectionScreenProps {
  onBack: () => void;
  onStartGame: (playerCount: 2 | 4, rules: GameRulesConfig) => void;
}

/** Lets the player choose between 2 players, 4 players and Azneef (coming soon). */
export const ModeSelectionScreen: React.FC<ModeSelectionScreenProps> = ({
  onBack,
  onStartGame,
}) => {
  const { l10n, settings } = useSettings();
  const targetScore = settings.targetScore;
  const targetText = l10n.targetScoreLabel(targetScore);

  const start = (playerCount: 2 | 4) => {
    onStartGame(playerCount, {
      ...defaultGameRulesConfig,
      targetScore,
    });
  };

  return (
    <div className="w-full h-full flex flex-col">
      <AppHeader title={l10n.chooseMode} onBack={onBack} />
      <div className="flex-1 min-h-0">
        <WoodTable>
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-[340px] flex flex-col gap-3.5">
              <GameButton
                label={l10n.modeTwoPlayers}
                subtitle={`${l10n.modeTwoPlayersDesc}\n${targetText}`}
                icon={<User className="w-5 h-5" />}
                primary
                onClick={() => start(2)}
              />
              <GameButton
                label={l10n.modeFourPlayers}
                subtitle={`${l10n.modeFourPlayersDesc}\n${targetText}`}
                icon={<Users className="w-5 h-5" />}
                primary
                onClick={() => start(4)}
              />
              <GameButton
                label={l10n.modeAzneef}
                subtitle={l10n.comingSoon}
                icon={<Lock className="w-5 h-5" />}
                disabled
              />
            </div>
          </div>
        </WoodTable>
      </div>
    </div>
  );
};
