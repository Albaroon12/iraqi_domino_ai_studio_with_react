export type RoundEndKind = 'domino' | 'blocked' | 'burned';

export interface RoundResult {
  readonly kind: RoundEndKind;
  /** The seat that starts the next round (undefined for a burned round). */
  readonly winnerSeat?: number;
  /** 0 = your team (seats 0 and 2), 1 = the other team. With 2 players it is the seat number. */
  readonly winnerTeam?: number;
  /** Points won: the pips left in the opposing team's hands. */
  readonly points: number;
}
