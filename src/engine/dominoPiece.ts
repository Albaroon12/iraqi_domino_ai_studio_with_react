/**
 * One piece of the double-six domino set.
 * low must be <= high, so every piece has exactly one representation.
 */
export interface DominoPiece {
  readonly low: number;
  readonly high: number;
}

export function createDominoPiece(low: number, high: number): DominoPiece {
  if (low < 0 || high > 6 || low > high) {
    throw new RangeError(`Invalid domino piece: ${low}-${high}`);
  }
  return { low, high };
}

export function isDouble(piece: DominoPiece): boolean {
  return piece.low === piece.high;
}

export function piecePips(piece: DominoPiece): number {
  return piece.low + piece.high;
}

export function hasSide(piece: DominoPiece, value: number): boolean {
  return piece.low === value || piece.high === value;
}

export function pieceEquals(a: DominoPiece, b: DominoPiece): boolean {
  return a.low === b.low && a.high === b.high;
}

export function comparePieces(a: DominoPiece, b: DominoPiece): number {
  return a.low !== b.low ? a.low - b.low : a.high - b.high;
}

export function formatPiece(piece: DominoPiece): string {
  return `${piece.low}-${piece.high}`;
}

/** The 28 pieces of the double-six set: 0-0, 0-1 ... 6-6. */
export function fullSet(): DominoPiece[] {
  const pieces: DominoPiece[] = [];
  for (let a = 0; a <= 6; a++) {
    for (let b = a; b <= 6; b++) {
      pieces.push({ low: a, high: b });
    }
  }
  return pieces;
}
