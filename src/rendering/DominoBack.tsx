import React from 'react';
import { ivorySkin, TileSkin } from './tileSkin';

export interface DominoBackProps {
  width?: number;
  horizontal?: boolean;
  skin?: TileSkin;
}

/** A face-down domino tile used for hidden hands of other players. */
export const DominoBack: React.FC<DominoBackProps> = ({
  width = 20,
  horizontal = false,
  skin = ivorySkin,
}) => {
  const w = horizontal ? width * 2 : width;
  const h = horizontal ? width : width * 2;
  const radius = width * 0.18;

  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: radius,
        background: `linear-gradient(135deg, ${skin.bodyLight}, ${skin.bodyDark})`,
        border: `1px solid ${skin.bevelDark}`,
        boxShadow: `${width * 0.05}px ${width * 0.12}px ${width * 0.25}px rgba(0,0,0,0.4)`,
      }}
      className="flex items-center justify-center shrink-0"
    >
      <div
        style={{
          width: horizontal ? 1.5 : width * 0.6,
          height: horizontal ? width * 0.6 : 1.5,
          backgroundColor: skin.grooveColor,
        }}
      />
    </div>
  );
};
