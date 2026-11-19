import React from 'react';
import { Play, Settings } from 'lucide-react';
import { DominoTile } from '../../rendering/DominoTile';
import { WoodTable } from '../../rendering/WoodTable';
import { useSettings } from '../../state/settingsContext';
import { GameButton } from '../widgets/GameButton';

export interface MainMenuScreenProps {
  onPlay: () => void;
  onSettings: () => void;
  onOpenGallery: () => void;
  onOpenTablePreview: () => void;
}

/** The main menu: first screen the player sees. */
export const MainMenuScreen: React.FC<MainMenuScreenProps> = ({
  onPlay,
  onSettings,
  onOpenGallery,
  onOpenTablePreview,
}) => {
  const { l10n } = useSettings();

  return (
    <div className="w-full h-full flex flex-col">
      <WoodTable>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-[320px] flex flex-col items-center">
            {/* Decorative logo: three tiles */}
            <div className="flex items-center justify-center gap-3.5" dir="ltr">
              <DominoTile top={3} bottom={5} width={38} />
              <DominoTile top={6} bottom={6} width={38} />
              <DominoTile top={1} bottom={4} width={38} />
            </div>

            <h1
              className="mt-7 text-center text-[36px] font-bold text-[#C9A24B] leading-tight"
              style={{ textShadow: '0 3px 8px rgba(0, 0, 0, 0.67)' }}
            >
              {l10n.appTitle}
            </h1>

            <div className="mt-10 w-full flex flex-col gap-3.5">
              <GameButton
                label={l10n.play}
                icon={<Play className="w-5 h-5 fill-current" />}
                primary
                onClick={onPlay}
              />
              <GameButton
                label={l10n.settings}
                icon={<Settings className="w-5 h-5" />}
                onClick={onSettings}
              />
            </div>

            <div className="mt-7 flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={onOpenGallery}
                className="px-3 py-1.5 text-sm font-medium text-[#C9A24B]/90 hover:text-[#C9A24B] hover:underline cursor-pointer"
              >
                {l10n.tileGallery}
              </button>
              <button
                type="button"
                onClick={onOpenTablePreview}
                className="px-3 py-1.5 text-sm font-medium text-[#C9A24B]/90 hover:text-[#C9A24B] hover:underline cursor-pointer"
              >
                {l10n.tablePreview}
              </button>
            </div>
          </div>
        </div>
      </WoodTable>
    </div>
  );
};
