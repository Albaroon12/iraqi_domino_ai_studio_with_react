import { Board } from '../engine/board';
import {
  boxBottom,
  boxIsVertical,
  boxRight,
  createLayoutBox,
  LaidTile,
  LayoutBox,
} from './boardLayout';

type Dir = 'down' | 'up' | 'left' | 'right';

interface Placed {
  readonly box: LayoutBox;
  readonly travel: Dir;
}

interface Arm {
  readonly sign: -1 | 1;
  dir: -1 | 1;
  x: number;
  edge: number;
  last: LayoutBox;
  justTurned: boolean;
}

export interface SerpentineLayoutResult {
  readonly tileWidth: number;
  readonly tiles: readonly LaidTile[];
  readonly leftSlot: LayoutBox;
  readonly rightSlot: LayoutBox;
  readonly overflow: boolean;
}

const GAP = 2;
const MARGIN = 4;
const DOUBLE_MARGIN = 1;
const MIN_ARM_TILES = 27; // 1 center + 27 arm tiles = all 28 dominoes on one side
const MAX_TILE_WIDTH = 34;
const MIN_TILE_WIDTH = 8;
const EPS = 0.01;

function centerBox(cx: number, cy: number, w: number, isDouble: boolean): LayoutBox {
  return isDouble
    ? createLayoutBox(cx - w, cy - w / 2, 2 * w, w)
    : createLayoutBox(cx - w / 2, cy - w, w, 2 * w);
}

function valuesForDir(dir: Dir, toward: number, outward: number): [number, number] {
  if (dir === 'right' || dir === 'down') {
    return [toward, outward];
  }
  return [outward, toward];
}

function within(b: LayoutBox, m: number, width: number, height: number): boolean {
  return (
    b.left >= m - EPS &&
    b.top >= m - EPS &&
    boxRight(b) <= width - m + EPS &&
    boxBottom(b) <= height - m + EPS
  );
}

function nextPlacement(
  a: Arm,
  isDouble: boolean,
  w: number,
  width: number,
  height: number,
  force: boolean
): Placed | null {
  // Doubles are crosswise (2w x w) along vertical columns, EXCEPT in the turn
  // area (making the horizontal turn or immediately exiting the horizontal turn
  // piece), where they lie lengthwise along the travel path like regular tiles.
  const verticalDouble = isDouble && a.justTurned;
  const len = isDouble && !verticalDouble ? w : 2 * w;
  const thick = isDouble && !verticalDouble ? 2 * w : w;
  const m = MARGIN;

  const top = a.dir > 0 ? a.edge + GAP : a.edge - GAP - len;
  const straight = createLayoutBox(a.x - thick / 2, top, thick, len);

  if (within(straight, m, width, height)) {
    a.edge = a.dir > 0 ? boxBottom(straight) : straight.top;
    a.last = straight;
    a.justTurned = false;
    return { box: straight, travel: a.dir > 0 ? 'down' : 'up' };
  }

  const last = a.last;
  const halfTop = boxIsVertical(last)
    ? a.dir > 0
      ? boxBottom(last) - w
      : last.top
    : last.top;
  const turnLeft = a.sign < 0 ? last.left - GAP - 2 * w : boxRight(last) + GAP;
  const turn = createLayoutBox(turnLeft, halfTop, 2 * w, w);

  if (!within(turn, MARGIN, width, height) && !force) return null;

  a.x = a.sign < 0 ? turn.left + w / 2 : boxRight(turn) - w / 2;
  a.dir = (a.dir === 1 ? -1 : 1) as -1 | 1;
  a.edge = a.dir > 0 ? boxBottom(turn) : turn.top;
  a.last = turn;
  a.justTurned = true;
  return { box: turn, travel: a.sign < 0 ? 'left' : 'right' };
}

export const SerpentineLayout = {
  gap: GAP,
  margin: MARGIN,
  doubleMargin: DOUBLE_MARGIN,
  minArmTiles: MIN_ARM_TILES,
  maxTileWidth: MAX_TILE_WIDTH,
  minTileWidth: MIN_TILE_WIDTH,

  armCapacity(width: number, height: number, w: number, xMargin?: number): number {
    const cx = width / 2;
    const center = centerBox(cx, height / 2, w, false);
    const arm: Arm = {
      sign: -1,
      dir: 1,
      x: cx,
      edge: boxBottom(center),
      last: center,
      justTurned: false,
    };
    let n = 0;
    let turns = 0;
    while (n < 200) {
      const wasTurnedEdge = arm.x;
      const placed = nextPlacement(arm, false, w, width, height, false);
      if (placed === null) break;
      if (arm.x !== wasTurnedEdge) turns++;
      const reqMargin = xMargin ?? MARGIN + 0.5 * (turns + 1) * w;
      if (
        placed.box.left < reqMargin - EPS ||
        boxRight(placed.box) > width - reqMargin + EPS
      ) {
        break;
      }
      n++;
    }
    return n;
  },

  tileWidthFor(width: number, height: number): number {
    for (let w = MAX_TILE_WIDTH; w >= MIN_TILE_WIDTH; w -= 0.5) {
      if (SerpentineLayout.armCapacity(width, height, w) >= MIN_ARM_TILES) {
        return w;
      }
    }
    return MIN_TILE_WIDTH;
  },

  fit(
    board: Board,
    width: number,
    height: number,
    ghostDouble = false
  ): SerpentineLayoutResult {
    return SerpentineLayout.compute(
      board,
      width,
      height,
      SerpentineLayout.tileWidthFor(width, height),
      ghostDouble
    );
  },

  compute(
    board: Board,
    width: number,
    height: number,
    w: number,
    ghostDouble = false
  ): SerpentineLayoutResult {
    const cx = width / 2;
    const cy = height / 2;
    const line = board.line;

    if (line.length === 0) {
      const slot = centerBox(cx, cy, w, ghostDouble);
      return {
        tileWidth: w,
        tiles: [],
        leftSlot: slot,
        rightSlot: slot,
        overflow: false,
      };
    }

    const start = board.startIndex;
    const center = line[start];
    const centerB = centerBox(cx, cy, w, center.isDouble);

    const right = line.slice(start + 1);
    const left = line.slice(0, start).reverse();

    const lower: Arm = {
      sign: -1,
      dir: 1,
      x: cx,
      edge: boxBottom(centerB),
      last: centerB,
      justTurned: false,
    };
    const upper: Arm = {
      sign: 1,
      dir: -1,
      x: cx,
      edge: centerB.top,
      last: centerB,
      justTurned: false,
    };

    const rightPlaced = right.map(
      (p) => nextPlacement(lower, p.isDouble, w, width, height, true)!
    );
    const leftPlaced = left.map(
      (p) => nextPlacement(upper, p.isDouble, w, width, height, true)!
    );

    const rightGhost = nextPlacement(lower, ghostDouble, w, width, height, true)!;
    const leftGhost = nextPlacement(upper, ghostDouble, w, width, height, true)!;

    const tiles: (LaidTile | null)[] = Array(line.length).fill(null);
    tiles[start] = {
      box: centerB,
      firstValue: center.leftValue,
      secondValue: center.rightValue,
      isDouble: center.isDouble,
      isVertical: boxIsVertical(centerB),
    };

    for (let i = 0; i < right.length; i++) {
      const p = right[i];
      const placed = rightPlaced[i];
      const [v1, v2] = valuesForDir(placed.travel, p.leftValue, p.rightValue);
      tiles[start + 1 + i] = {
        box: placed.box,
        firstValue: v1,
        secondValue: v2,
        isDouble: p.isDouble,
        isVertical: boxIsVertical(placed.box),
      };
    }

    for (let i = 0; i < left.length; i++) {
      const p = left[i];
      const placed = leftPlaced[i];
      const [v1, v2] = valuesForDir(placed.travel, p.rightValue, p.leftValue);
      tiles[start - 1 - i] = {
        box: placed.box,
        firstValue: v1,
        secondValue: v2,
        isDouble: p.isDouble,
        isVertical: boxIsVertical(placed.box),
      };
    }

    const all = tiles as LaidTile[];
    const overflow = all.some((t) => !within(t.box, 0, width, height));

    return {
      tileWidth: w,
      tiles: all,
      leftSlot: leftGhost.box,
      rightSlot: rightGhost.box,
      overflow,
    };
  },
};
