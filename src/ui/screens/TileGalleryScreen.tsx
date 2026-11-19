import React, { useState } from 'react';
import { getTileSkinName } from '../../l10n/translations';
import { DominoTile } from '../../rendering/DominoTile';
import { allTileSkins, ivorySkin, TileSkin } from '../../rendering/tileSkin';
import { useSettings } from '../../state/settingsContext';
import { AppHeader } from '../widgets/AppHeader';

const ALL_TILES: readonly [number, number][] = (() => {
  const list: [number, number][] = [];
  for (let a = 0; a <= 6; a++) {
    for (let b = a; b <= 6; b++) {
      list.push([a, b]);
    }
  }
  return list;
})();

export interface TileGalleryScreenProps {
  onBack: () => void;
}

/** Developer screen: shows all 28 tiles at adjustable sizes and skins. */
export const TileGalleryScreen: React.FC<TileGalleryScreenProps> = ({ onBack }) => {
  const { l10n } = useSettings();
  const [tileWidth, setTileWidth] = useState(48);
  const [skin, setSkin] = useState<TileSkin>(ivorySkin);

  return (
    <div className="w-full h-full flex flex-col bg-[#2B1B12]">
      <AppHeader title={l10n.tileGallery} onBack={onBack} />

      <div className="px-4 pt-3 flex flex-wrap gap-2">
        {allTileSkins.map((s) => {
          const selected = skin.id === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSkin(s)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-bold border transition-colors cursor-pointer ${
                selected
                  ? 'bg-[#C9A24B] text-[#2B1B12] border-[#C9A24B]'
                  : 'bg-[#1D110A] text-[#F5EFE0] border-[#C9A24B]/30'
              }`}
            >
              {getTileSkinName(l10n, s.id)}
            </button>
          );
        })}
      </div>

      <div className="px-4 py-2 flex items-center gap-3">
        <span className="text-[#F5EFE0] text-sm font-bold tabular-nums w-8">
          {Math.round(tileWidth)}
        </span>
        <input
          type="range"
          min={24}
          max={90}
          value={tileWidth}
          onChange={(e) => setTileWidth(Number(e.target.value))}
          className="flex-1 accent-[#C9A24B] cursor-pointer"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex flex-wrap gap-x-[18px] gap-y-[22px] items-center" dir="ltr">
          {ALL_TILES.map(([a, b]) => (
            <DominoTile
              key={`${a}-${b}`}
              top={a}
              bottom={b}
              width={tileWidth}
              skin={skin}
            />
          ))}
          <DominoTile top={6} bottom={6} width={tileWidth} horizontal skin={skin} />
        </div>
      </div>
    </div>
  );
};
