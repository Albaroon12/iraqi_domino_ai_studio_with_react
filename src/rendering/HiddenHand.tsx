import React from 'react';
import { DominoBack } from './DominoBack';
import { TileSkin } from './tileSkin';

export interface HiddenHandProps {
  count: number;
  skin: TileSkin;
  tileWidth?: number;
  gap?: number;
  vertical?: boolean;
}

/** A row or column of face-down tiles showing how many tiles another player holds. */
export const HiddenHand: React.FC<HiddenHandProps> = ({
  count,
  skin,
  tileWidth = 18,
  gap,
  vertical = false,
}) => {
  const effectiveGap = gap ?? tileWidth * 0.18;

  return (
    <div
      className={`inline-flex items-center justify-center ${
        vertical ? 'flex-col' : 'flex-row'
      }`}
      style={{ gap: effectiveGap }}
    >
      {Array.from({ length: count }, (_, idx) => (
        <DominoBack
          key={idx}
          width={tileWidth}
          horizontal={vertical}
          skin={skin}
        />
      ))}
    </div>
  );
};
