import { DominoPiece, fullSet, pieceEquals } from './dominoPiece';

export interface RoundSetup {
  readonly hands: DominoPiece[][];
  readonly boneyard: DominoPiece[];
  readonly startSeat: number;
  readonly startPiece: DominoPiece;
}

const DEAL_PATTERN = [2, 2, 3] as const;

function shuffleInPlace<T>(arr: T[], rng: () => number): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function findStart(
  hands: DominoPiece[][]
): { seat: number; piece: DominoPiece } | null {
  for (let value = 6; value >= 0; value--) {
    const dbl: DominoPiece = { low: value, high: value };
    for (let seat = 0; seat < hands.length; seat++) {
      if (hands[seat].some((p) => pieceEquals(p, dbl))) {
        return { seat, piece: dbl };
      }
    }
  }
  return null;
}

export const Dealer = {
  handSize: 7,
  dealPattern: DEAL_PATTERN,

  /**
   * Shuffles the full set and deals it in the 2-2-3 pattern.
   */
  deal(
    playerCount: 2 | 4,
    rng: () => number = Math.random
  ): { hands: DominoPiece[][]; boneyard: DominoPiece[] } {
    const pile = shuffleInPlace(fullSet(), rng);
    const hands: DominoPiece[][] = Array.from({ length: playerCount }, () => []);

    let next = 0;
    for (const chunk of DEAL_PATTERN) {
      for (let seat = 0; seat < playerCount; seat++) {
        hands[seat].push(...pile.slice(next, next + chunk));
        next += chunk;
      }
    }

    return { hands, boneyard: pile.slice(next) };
  },

  /**
   * Deals the FIRST round of a match:
   * - 4 players: holder of 6-6 starts and opens with 6-6.
   * - 2 players: holder of the highest double starts and opens with it.
   */
  dealFirstRound(playerCount: 2 | 4, rng: () => number = Math.random): RoundSetup {
    while (true) {
      const dealt = Dealer.deal(playerCount, rng);
      const start = findStart(dealt.hands);
      if (start !== null) {
        return {
          hands: dealt.hands,
          boneyard: dealt.boneyard,
          startSeat: start.seat,
          startPiece: start.piece,
        };
      }
    }
  },
};
