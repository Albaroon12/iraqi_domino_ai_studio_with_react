import React, { useEffect, useRef, useState } from 'react';
import { Board, BoardEnd } from '../engine/board';
import { DominoTile } from './DominoTile';
import { LayoutBox } from './boardLayout';
import { SerpentineLayout } from './serpentineLayout';
import { TileSkin } from './tileSkin';

export interface BoardViewProps {
  board: Board;
  boardVersion: number;
  skin: TileSkin;
  ghostDouble?: boolean;
  activeEnds?: readonly BoardEnd[];
  litEnds?: ReadonlySet<BoardEnd>;
  onSlotTap?: (end: BoardEnd) => void;
  leftSlotRef?: React.RefObject<HTMLButtonElement | null>;
  rightSlotRef?: React.RefObject<HTMLButtonElement | null>;
}

/**
 * Draws the serpentine line of play and the ghost slots where the next piece can land.
 */
export const BoardView: React.FC<BoardViewProps> = ({
  board,
  boardVersion,
  skin,
  ghostDouble = false,
  activeEnds = [],
  litEnds = new Set<BoardEnd>(),
  onSlotTap,
  leftSlotRef,
  rightSlotRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize((prev) =>
        prev.width === rect.width && prev.height === rect.height
          ? prev
          : { width: rect.width, height: rect.height }
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Recompute layout whenever boardVersion, dimensions, or ghostDouble changes
  void boardVersion;
  const hasSize = size.width > 0 && size.height > 0;
  const layout = hasSize
    ? SerpentineLayout.fit(board, size.width, size.height, ghostDouble)
    : null;

  const renderSlot = (
    end: BoardEnd,
    box: LayoutBox,
    w: number,
    ref?: React.RefObject<HTMLButtonElement | null>
  ) => {
    const visible = activeEnds.includes(end);
    const lit = litEnds.has(end);

    return (
      <button
        key={`slot-${end}`}
        ref={ref}
        type="button"
        disabled={!visible || !onSlotTap}
        onClick={() => visible && onSlotTap?.(end)}
        aria-label={`Place on ${end} end`}
        style={{
          left: box.left,
          top: box.top,
          width: box.width,
          height: box.height,
          borderRadius: w * 0.18,
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          backgroundColor: lit ? 'rgba(201, 162, 75, 0.35)' : 'transparent',
          border: `${lit ? 2.5 : 1.5}px solid rgba(201, 162, 75, ${lit ? 1 : 0.45})`,
          boxShadow: lit ? '0 0 14px rgba(201, 162, 75, 0.6)' : 'none',
          transition: visible ? 'opacity 150ms ease, background-color 150ms ease' : 'none',
        }}
        className="absolute cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C9A24B]"
      />
    );
  };

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {layout && (
        <>
          {layout.tiles.map((t, idx) => (
            <div
              key={idx}
              style={{ left: t.box.left, top: t.box.top }}
              className="absolute pointer-events-none"
            >
              {t.isVertical ? (
                <DominoTile
                  top={t.firstValue}
                  bottom={t.secondValue}
                  width={layout.tileWidth}
                  skin={skin}
                />
              ) : (
                <DominoTile
                  top={t.secondValue}
                  bottom={t.firstValue}
                  width={layout.tileWidth}
                  horizontal
                  skin={skin}
                />
              )}
            </div>
          ))}
          {!board.isEmpty &&
            renderSlot('left', layout.leftSlot, layout.tileWidth, leftSlotRef)}
          {renderSlot('right', layout.rightSlot, layout.tileWidth, rightSlotRef)}
        </>
      )}
    </div>
  );
};
