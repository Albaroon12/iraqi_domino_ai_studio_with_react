import { Board, Move, moveEquals } from './board';
import { DominoPiece, pieceEquals, piecePips } from './dominoPiece';
import { RoundResult } from './roundResult';

/**
 * The state of one round.
 * Seats are numbered counter-clockwise from the bottom player (0 = you).
 */
export class RoundState {
  readonly playerCount: 2 | 4;
  readonly hands: DominoPiece[][];
  readonly boneyard: DominoPiece[];
  readonly startSeat: number;
  readonly openingPiece: DominoPiece | null;
  readonly board = new Board();

  turn: number;
  lastPlayedSeat = -1;
  consecutivePasses = 0;
  result: RoundResult | null = null;

  constructor(params: {
    playerCount: 2 | 4;
    hands: DominoPiece[][];
    boneyard: DominoPiece[];
    startSeat: number;
    openingPiece?: DominoPiece | null;
  }) {
    this.playerCount = params.playerCount;
    this.hands = params.hands.map((hand) => [...hand]);
    this.boneyard = [...params.boneyard];
    this.startSeat = params.startSeat;
    this.openingPiece = params.openingPiece ?? null;
    this.turn = params.startSeat;
  }

  get isOver(): boolean {
    return this.result !== null;
  }

  static teamOf(seat: number, playerCount: 2 | 4): number {
    return playerCount === 4 ? seat % 2 : seat;
  }

  legalMoves(): Move[] {
    if (this.isOver) return [];
    const hand = this.hands[this.turn];

    if (this.board.isEmpty) {
      const open = this.openingPiece;
      const moves: Move[] = [];
      for (const piece of hand) {
        if (open === null || pieceEquals(piece, open)) {
          moves.push({ piece, end: 'right' });
        }
      }
      return moves;
    }

    const moves: Move[] = [];
    for (const piece of hand) {
      for (const end of this.board.endsFor(piece)) {
        moves.push({ piece, end });
      }
    }
    return moves;
  }

  play(move: Move): void {
    if (!this.legalMoves().some((m) => moveEquals(m, move))) {
      throw new Error(`Illegal move: ${move.piece.low}-${move.piece.high} on ${move.end}`);
    }

    this.board.place(move.piece, move.end);
    const hand = this.hands[this.turn];
    const idx = hand.findIndex((p) => pieceEquals(p, move.piece));
    if (idx !== -1) hand.splice(idx, 1);

    this.lastPlayedSeat = this.turn;
    this.consecutivePasses = 0;

    if (hand.length === 0) {
      this._finishDomino(this.turn);
    } else {
      this.turn = (this.turn + 1) % this.playerCount;
    }
  }

  draw(): DominoPiece {
    if (this.isOver) throw new Error('The round is over');
    if (this.playerCount !== 2) throw new Error('Drawing is for two players only');
    if (this.boneyard.length === 0) throw new Error('The draw pile is empty');
    if (this.legalMoves().length > 0) {
      throw new Error('Cannot draw: the player has a legal move');
    }

    const piece = this.boneyard.pop()!;
    this.hands[this.turn].push(piece);
    return piece;
  }

  pass(): void {
    if (this.isOver) throw new Error('The round is over');
    if (this.legalMoves().length > 0) {
      throw new Error('Cannot pass: the player has a legal move');
    }
    if (this.playerCount === 2 && this.boneyard.length > 0) {
      throw new Error('Cannot pass: the player must draw first');
    }

    this.consecutivePasses++;
    if (this.consecutivePasses >= this.playerCount) {
      this._finishBlocked();
    } else {
      this.turn = (this.turn + 1) % this.playerCount;
    }
  }

  private _teamOf(seat: number): number {
    return RoundState.teamOf(seat, this.playerCount);
  }

  private _handPips(seat: number): number {
    return this.hands[seat].reduce((sum, piece) => sum + piecePips(piece), 0);
  }

  private _opponentPips(team: number): number {
    let sum = 0;
    for (let seat = 0; seat < this.playerCount; seat++) {
      if (this._teamOf(seat) !== team) {
        sum += this._handPips(seat);
      }
    }
    return sum;
  }

  private _finishDomino(winnerSeat: number): void {
    const team = this._teamOf(winnerSeat);
    this.result = {
      kind: 'domino',
      winnerSeat,
      winnerTeam: team,
      points: this._opponentPips(team),
    };
  }

  private _finishBlocked(): void {
    const totals: number[] = [];
    for (let s = 0; s < this.playerCount; s++) {
      totals.push(this._handPips(s));
    }
    const lowest = Math.min(...totals);
    const lowSeats: number[] = [];
    for (let s = 0; s < this.playerCount; s++) {
      if (totals[s] === lowest) lowSeats.push(s);
    }

    const teams = new Set(lowSeats.map((s) => this._teamOf(s)));
    if (teams.size > 1) {
      this.result = { kind: 'burned', points: 0 };
      return;
    }

    let starter = lowSeats[0];
    let closest: number = this.playerCount;
    for (const seat of lowSeats) {
      const distance =
        (seat - this.lastPlayedSeat + this.playerCount) % this.playerCount;
      if (distance < closest) {
        closest = distance;
        starter = seat;
      }
    }

    const team = teams.values().next().value!;
    this.result = {
      kind: 'blocked',
      winnerSeat: starter,
      winnerTeam: team,
      points: this._opponentPips(team),
    };
  }
}
