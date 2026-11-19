import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { DominoTile } from '../../rendering/DominoTile';
import { allTileSkins } from '../../rendering/tileSkin';
import { WoodTable } from '../../rendering/WoodTable';
import { useSettings } from '../../state/settingsContext';
import { AppHeader } from '../widgets/AppHeader';

const SAMPLE_HAND: readonly [number, number][] = [
  [0, 1],
  [2, 3],
  [4, 4],
  [1, 6],
  [5, 2],
  [3, 3],
  [6, 0],
];

export interface TablePreviewScreenProps {
  onBack: () => void;
}

/** Developer screen: wooden table with a sample line of play and hand. */
export const TablePreviewScreen: React.FC<TablePreviewScreenProps> = ({ onBack }) => {
  const { l10n } = useSettings();
  const [skinIndex, setSkinIndex] = useState(0);
  const skin = allTileSkins[skinIndex];
  const lineTileWidth = 36;

  return (
    <div className="w-full h-full flex flex-col">
      <AppHeader
        title={l10n.tablePreview}
        onBack={onBack}
        action={
          <button
            type="button"
            onClick={() => setSkinIndex((i) => (i + 1) % allTileSkins.length)}
            aria-label="Switch tile skin"
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Palette className="w-5 h-5" />
          </button>
        }
      />
      <div className="flex-1 min-h-0">
        <WoodTable>
          <div className="flex-1 flex flex-col items-center justify-between p-6">
            <div className="flex-1 flex items-center justify-center" dir="ltr">
              <div className="flex items-center gap-0.5">
                <DominoTile top={2} bottom={4} width={lineTileWidth} horizontal skin={skin} />
                <DominoTile top={6} bottom={2} width={lineTileWidth} horizontal skin={skin} />
                <DominoTile top={6} bottom={6} width={lineTileWidth} skin={skin} />
                <DominoTile top={3} bottom={6} width={lineTileWidth} horizontal skin={skin} />
              </div>
            </div>

            <div className="pb-4 flex flex-wrap justify-center gap-1.5" dir="ltr">
              {SAMPLE_HAND.map(([a, b]) => (
                <DominoTile key={`${a}-${b}`} top={a} bottom={b} width={44} skin={skin} />
              ))}
            </div>
          </div>
        </WoodTable>
      </div>
    </div>
  );
};
