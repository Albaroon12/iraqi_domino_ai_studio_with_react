import { DominoPiece, hasSide, isDouble, pieceEquals } from './dominoPiece';

export type BoardEnd = 'left' | 'right';

/**
 * A piece lying on the table. leftValue and rightValue are the dots
 * on its left and right half, as seen along the line of play.
 */
export interface PlacedPiece {
  readonly piece: DominoPiece;
  readonly leftValue: number;
  readonly rightValue: number;
  readonly isDouble: boolean;
}

export interface Move {
  readonly piece: DominoPiece;
  readonly end: BoardEnd;
}

export function moveEquals(a: Move, b: Move): boolean {
  return a.end === b.end && pieceEquals(a.piece, b.piece);
}

/**
 * The single line of play (no branches in standard Iraqi Domino mode).
 */
export class Board {
  private readonly _line: PlacedPiece[] = [];
  private readonly _history: BoardEnd[] = [];
  private _leftCount = 0;

  /** Index (in line) of the first piece played: the center of the layout. */
  get startIndex(): number {
    return this._leftCount;
  }

  /** Pieces from the left end to the right end. */
  get line(): readonly PlacedPiece[] {
    return this._line;
  }

  /**
   * The end used by every placement, in the order the pieces were played.
   * The first entry is the opening piece (always 'right').
   */
  get history(): readonly BoardEnd[] {
    return this._history;
  }

  get isEmpty(): boolean {
    return this._line.length === 0;
  }

  get leftEnd(): number | null {
    return this.isEmpty ? null : this._line[0].leftValue;
  }

  get rightEnd(): number | null {
    return this.isEmpty ? null : this._line[this._line.length - 1].rightValue;
  }

  /** The ends where piece could be played. */
  endsFor(piece: DominoPiece): BoardEnd[] {
    if (this.isEmpty) return ['right'];
    const ends: BoardEnd[] = [];
    if (hasSide(piece, this.leftEnd!)) ends.push('left');
    if (hasSide(piece, this.rightEnd!)) ends.push('right');
    return ends;
  }

  /** Places piece on end, turning it so the matching half touches the open end. */
  place(piece: DominoPiece, end: BoardEnd): void {
    if (!this.endsFor(piece).includes(end)) {
      throw new Error(`${piece.low}-${piece.high} cannot be played on ${end}`);
    }

    this._history.push(end);

    if (this.isEmpty) {
      this._line.push({
        piece,
        leftValue: piece.low,
        rightValue: piece.high,
        isDouble: isDouble(piece),
      });
      return;
    }

    if (end === 'right') {
      const touching = this.rightEnd!;
      const outer = piece.low === touching ? piece.high : piece.low;
      this._line.push({
        piece,
        leftValue: touching,
        rightValue: outer,
        isDouble: isDouble(piece),
      });
    } else {
      const touching = this.leftEnd!;
      const outer = piece.low === touching ? piece.high : piece.low;
      this._line.unshift({
        piece,
        leftValue: outer,
        rightValue: touching,
        isDouble: isDouble(piece),
      });
      this._leftCount++;
    }
  }
}
