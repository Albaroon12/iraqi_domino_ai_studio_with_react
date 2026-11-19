import React from 'react';
import { User } from 'lucide-react';
import { HiddenHand } from '../../rendering/HiddenHand';
import { TileSkin } from '../../rendering/tileSkin';

export interface OpponentDockProps {
  name: string;
  tileCount: number;
  isTurn: boolean;
  skin: TileSkin;
  orientation: 'horizontal' | 'vertical';
  score?: number;
  targetScore?: number;
}

/**
 * Organized, shaded player dock for top, left, and right opponents/partner:
 * avatar with tile-count badge, full unclipped name, score/target pill, and a
 * recessed shaded tray holding their face-down tiles.
 */
export const OpponentDock: React.FC<OpponentDockProps> = ({
  name,
  tileCount,
  isTurn,
  skin,
  orientation,
  score,
  targetScore,
}) => {
  const isVertical = orientation === 'vertical';
  const topTileWidth =
    tileCount > 17 ? 7 : tileCount > 13 ? 8 : tileCount > 9 ? 9 : 10;
  const topTileGap = tileCount > 13 ? 1 : undefined;
  const sideTileWidth = 10;

  const dockStyle: React.CSSProperties = {
    backgroundColor: 'rgba(29, 17, 10, 0.76)',
    border: isTurn
      ? '1.5px solid #C9A24B'
      : '1px solid rgba(201, 162, 75, 0.28)',
    boxShadow: isTurn
      ? '0 0 14px rgba(201, 162, 75, 0.45)'
      : '0 4px 10px rgba(0, 0, 0, 0.35)',
    borderRadius: 14,
  };

  const trayStyle: React.CSSProperties = {
    backgroundColor: 'rgba(14, 7, 3, 0.58)',
    border: '1px solid rgba(201, 162, 75, 0.20)',
    boxShadow: 'inset 0 1px 4px rgba(0, 0, 0, 0.50)',
    borderRadius: 9,
  };

  const scorePill = score !== undefined && (
    <span
      dir="ltr"
      className="inline-flex items-baseline gap-0.5 px-1.5 py-0.5 rounded-full bg-[#C9A24B]/15 border border-[#C9A24B]/35 leading-none tabular-nums"
    >
      <span className="text-[#F5EFE0] text-[10.5px] font-extrabold">
        {score}
      </span>
      {targetScore !== undefined && (
        <span className="text-[#C9A24B] text-[9.5px] font-semibold">
          / {targetScore}
        </span>
      )}
    </span>
  );

  const avatar = (
    <div className="relative w-[26px] h-[26px] flex items-center justify-center shrink-0">
      <div
        style={{
          backgroundColor: '#4A3020',
          borderColor: isTurn ? '#C9A24B' : 'rgba(201, 162, 75, 0.40)',
          borderWidth: isTurn ? 2 : 1.5,
        }}
        className="w-[26px] h-[26px] rounded-full border-solid flex items-center justify-center transition-colors duration-200"
      >
        <User className="w-3.5 h-3.5 text-[#F5EFE0]" />
      </div>
      <div
        style={{ backgroundColor: '#C9A24B', color: '#2B1B12' }}
        className="absolute -right-[6px] -bottom-[2px] min-w-[15px] h-[15px] px-1 rounded-[8px] flex items-center justify-center text-[10px] font-extrabold leading-none tabular-nums"
      >
        {tileCount}
      </div>
    </div>
  );

  if (isVertical) {
    return (
      <div
        style={dockStyle}
        className="w-full flex flex-col items-center px-1 py-1.5 select-none transition-all duration-200"
      >
        {avatar}
        <div
          dir="auto"
          className="mt-1 w-full text-[#F5EFE0] text-[10.5px] font-bold leading-[1.15] text-center break-words"
        >
          {name}
        </div>
        {score !== undefined && <div className="mt-1">{scorePill}</div>}
        <div
          style={{ ...trayStyle, minHeight: sideTileWidth * 2 + 10 }}
          className="mt-1.5 px-1.5 py-1.5 flex flex-col items-center justify-center"
        >
          {tileCount > 0 && (
            <HiddenHand
              count={tileCount}
              skin={skin}
              tileWidth={sideTileWidth}
              vertical
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={dockStyle}
      className="inline-flex flex-col items-center px-2 py-1 select-none transition-all duration-200"
    >
      <div className="flex items-center justify-center gap-1.5">
        {avatar}
        <span
          dir="auto"
          className="text-[#F5EFE0] text-[12px] font-bold leading-tight whitespace-nowrap"
        >
          {name}
        </span>
        {scorePill}
      </div>
      <div
        style={{ ...trayStyle, minHeight: 22 }}
        className={`mt-1 ${tileCount > 13 ? 'px-1.5' : 'px-2'} py-1 flex items-center justify-center`}
      >
        {tileCount > 0 && (
          <HiddenHand
            count={tileCount}
            skin={skin}
            tileWidth={topTileWidth}
            gap={topTileGap}
          />
        )}
      </div>
    </div>
  );
};
