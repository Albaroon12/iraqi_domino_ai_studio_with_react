import React, { useId } from 'react';
import { ivorySkin, TileSkin } from './tileSkin';

const PIP_LAYOUTS: Record<number, readonly [number, number][]> = {
  0: [],
  1: [[1, 1]],
  2: [
    [0, 0],
    [2, 2],
  ],
  3: [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  4: [
    [0, 0],
    [2, 0],
    [0, 2],
    [2, 2],
  ],
  5: [
    [0, 0],
    [2, 0],
    [1, 1],
    [0, 2],
    [2, 2],
  ],
  6: [
    [0, 0],
    [2, 0],
    [0, 1],
    [2, 1],
    [0, 2],
    [2, 2],
  ],
};

export interface DominoTileProps {
  top: number;
  bottom: number;
  width?: number;
  horizontal?: boolean;
  skin?: TileSkin;
  className?: string;
}

/**
 * Paints one domino tile (always 1:2 vertical geometry, rotated 90 deg clockwise when horizontal).
 */
export const DominoTile: React.FC<DominoTileProps> = ({
  top,
  bottom,
  width = 48,
  horizontal = false,
  skin = ivorySkin,
  className = '',
}) => {
  const uid = useId().replace(/:/g, '');
  const bodyGradId = `body-${uid}`;
  const bevelGradId = `bevel-${uid}`;
  const pipGradId = `pip-${uid}`;
  const shadowId = `shadow-${uid}`;

  // Use a canonical 100 x 200 vertical coordinate space so proportions match DominoTilePainter exactly.
  const vw = 100;
  const vh = 200;
  const corner = vw * 0.14;
  const bevelInset = vw * 0.03;
  const bevelCorner = Math.max(0, corner - bevelInset);

  const renderPips = (count: number, yOffset: number) => {
    const padX = vw * 0.24;
    const halfHeight = vh / 2;
    const padY = halfHeight * 0.24;
    const stepX = (vw - 2 * padX) / 2;
    const stepY = (halfHeight - 2 * padY) / 2;
    const radius = vw * 0.085;
    const cells = PIP_LAYOUTS[count] ?? [];

    return cells.map(([col, row], idx) => {
      const cx = padX + col * stepX;
      const cy = yOffset + padY + row * stepY;
      return (
        <g key={`${yOffset}-${idx}`}>
          <circle cx={cx} cy={cy + radius * 0.3} r={radius} fill={skin.pipRim} />
          <circle cx={cx} cy={cy} r={radius} fill={`url(#${pipGradId})`} />
        </g>
      );
    });
  };

  const renderW = horizontal ? width * 2 : width;
  const renderH = horizontal ? width : width * 2;
  const viewBox = horizontal ? `0 0 ${vh} ${vw}` : `0 0 ${vw} ${vh}`;

  return (
    <svg
      width={renderW}
      height={renderH}
      viewBox={viewBox}
      className={`block select-none overflow-visible ${className}`}
      aria-label={`Domino ${top}-${bottom}`}
    >
      <defs>
        <linearGradient id={bodyGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={skin.bodyLight} />
          <stop offset="100%" stopColor={skin.bodyDark} />
        </linearGradient>
        <linearGradient id={bevelGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={skin.bevelLight} />
          <stop offset="100%" stopColor={skin.bevelDark} />
        </linearGradient>
        <radialGradient id={pipGradId} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor={skin.pipHighlight} />
          <stop offset="100%" stopColor={skin.pipDark} />
        </radialGradient>
        <filter id={shadowId} x="-25%" y="-20%" width="160%" height="150%">
          <feGaussianBlur in="SourceAlpha" stdDeviation={vw * 0.055} />
          <feOffset dx={vw * 0.04} dy={vw * 0.07} />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.4" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform={horizontal ? `translate(${vh}, 0) rotate(90)` : undefined}>
        {/* Shadow + Tile Body */}
        <rect
          x={0}
          y={0}
          width={vw}
          height={vh}
          rx={corner}
          ry={corner}
          fill={`url(#${bodyGradId})`}
          filter={`url(#${shadowId})`}
        />

        {/* Inner bevel */}
        <rect
          x={bevelInset}
          y={bevelInset}
          width={vw - bevelInset * 2}
          height={vh - bevelInset * 2}
          rx={bevelCorner}
          ry={bevelCorner}
          fill="none"
          stroke={`url(#${bevelGradId})`}
          strokeWidth={vw * 0.045}
        />

        {/* Center engraved divider */}
        <line
          x1={vw * 0.14}
          y1={vh / 2}
          x2={vw * 0.86}
          y2={vh / 2}
          stroke={skin.grooveColor}
          strokeWidth={vw * 0.03}
          strokeLinecap="round"
        />
        <line
          x1={vw * 0.14}
          y1={vh / 2 + vw * 0.025}
          x2={vw * 0.86}
          y2={vh / 2 + vw * 0.025}
          stroke={skin.grooveEdge}
          strokeWidth={vw * 0.02}
          strokeLinecap="round"
        />

        {/* Pips */}
        {renderPips(top, 0)}
        {renderPips(bottom, vh / 2)}
      </g>
    </svg>
  );
};
