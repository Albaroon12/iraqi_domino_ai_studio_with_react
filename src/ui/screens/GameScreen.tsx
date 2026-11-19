import React, { useCallback, useEffect, useRef, useState } from 'react';
import { History, RefreshCw } from 'lucide-react';
import { BoardEnd, Move, moveEquals } from '../../engine/board';
import { Dealer, RoundSetup } from '../../engine/dealer';
import {
  comparePieces,
  DominoPiece,
  formatPiece,
  isDouble,
  pieceEquals,
} from '../../engine/dominoPiece';
import { GameRulesConfig } from '../../engine/gameRulesConfig';
import { RoundResult } from '../../engine/roundResult';
import { RoundState } from '../../engine/roundState';
import { BoardFrame } from '../../rendering/BoardFrame';
import { BoardView } from '../../rendering/BoardView';
import { DominoBack } from '../../rendering/DominoBack';
import { DominoTile } from '../../rendering/DominoTile';
import { WoodTable } from '../../rendering/WoodTable';
import { useSettings } from '../../state/settingsContext';
import { AppHeader } from '../widgets/AppHeader';
import { OpponentDock } from '../widgets/OpponentDock';
import { PlayerChip } from '../widgets/PlayerChip';
import {
  RoundHistoryDialog,
  RoundHistoryEntry,
} from '../widgets/RoundHistoryDialog';
import { RoundResultDialog } from '../widgets/RoundResultDialog';

const AI_DELAY_MS = 900;
const DRAW_DELAY_MS = 700;
const PASS_DELAY_MS = 1300;
const RESULT_DELAY_MS = 700;
const TURN_SECONDS = 30;
const FEEDBACK_WIDTH = 44;

const TOP_RESERVE = 78;
const BOARD_SIDE_MARGIN = 8;
const BOARD_BOTTOM_GAP = 2;
const SIDE_EDGE_MARGIN = 3;
const SIDE_BOARD_GAP = 4;

type StatusKind = 'noTiles' | 'passes' | 'draws';

interface DragSession {
  piece: DominoPiece;
  x: number;
  y: number;
  overHand: boolean;
}

function playTileClickSound(enabled: boolean) {
  if (!enabled) return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.045);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.055);
    setTimeout(() => {
      void ctx.close().catch(() => {});
    }, 150);
  } catch {
    // Ignore audio context restrictions
  }
}

export interface GameScreenProps {
  playerCount: 2 | 4;
  rules: GameRulesConfig;
  onBack: () => void;
}

/**
 * The main gameplay screen supporting 2-player and 4-player Iraqi Domino.
 */
export const GameScreen: React.FC<GameScreenProps> = ({
  playerCount,
  rules,
  onBack,
}) => {
  const { l10n, skin, settings } = useSettings();
  const isFour = playerCount === 4;
  const topSeat = isFour ? 2 : 1;

  const roundFromSetup = useCallback(
    (setup: RoundSetup) =>
      new RoundState({
        playerCount,
        hands: setup.hands,
        boneyard: setup.boneyard,
        startSeat: setup.startSeat,
        openingPiece: setup.startPiece,
      }),
    [playerCount]
  );

  const roundRef = useRef<RoundState>(
    roundFromSetup(Dealer.dealFirstRound(playerCount))
  );
  const recordedRoundsRef = useRef<WeakSet<RoundState>>(new WeakSet());
  const scoresRef = useRef<[number, number]>([0, 0]);
  const [boardVersion, setBoardVersion] = useState(0);
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [roundHistory, setRoundHistory] = useState<RoundHistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TURN_SECONDS);
  const [status, setStatus] = useState<{ seat: number; kind: StatusKind } | null>(
    null
  );
  const [myMoves, setMyMoves] = useState<Move[]>([]);
  const [pendingResult, setPendingResult] = useState<{
    result: RoundResult;
    ourTotal: number;
    theirTotal: number;
  } | null>(null);

  // Interaction state
  const [selected, setSelected] = useState<DominoPiece | null>(null);
  const [dragSession, setDragSession] = useState<DragSession | null>(null);
  const [hoverEnd, setHoverEnd] = useState<BoardEnd | null>(null);

  // Layout & drag refs
  const tableAreaRef = useRef<HTMLDivElement>(null);
  const boardZoneRef = useRef<HTMLDivElement>(null);
  const leftSlotRef = useRef<HTMLButtonElement | null>(null);
  const rightSlotRef = useRef<HTMLButtonElement | null>(null);
  const handScrollRef = useRef<HTMLDivElement>(null);

  const [tableSize, setTableSize] = useState({ width: 0, height: 0 });
  const [handAreaWidth, setHandAreaWidth] = useState(360);

  const actionTimerRef = useRef<number | null>(null);
  const turnIntervalRef = useRef<number | null>(null);
  const soundEnabledRef = useRef(settings.soundEnabled);
  soundEnabledRef.current = settings.soundEnabled;

  const clearTimers = useCallback(() => {
    if (actionTimerRef.current !== null) {
      window.clearTimeout(actionTimerRef.current);
      actionTimerRef.current = null;
    }
    if (turnIntervalRef.current !== null) {
      window.clearInterval(turnIntervalRef.current);
      turnIntervalRef.current = null;
    }
  }, []);

  const clearInteraction = useCallback(() => {
    setSelected(null);
    setDragSession(null);
    setHoverEnd(null);
  }, []);

  const advanceRef = useRef<() => void>(() => {});

  const executePlay = useCallback(
    (move: Move) => {
      roundRef.current.play(move);
      playTileClickSound(soundEnabledRef.current);
      setBoardVersion((v) => v + 1);
      advanceRef.current();
    },
    []
  );

  const advance = useCallback(() => {
    clearTimers();
    setMyMoves([]);
    const round = roundRef.current;

    if (round.isOver && round.result) {
      const res = round.result;
      actionTimerRef.current = window.setTimeout(() => {
        setStatus(null);
        if (recordedRoundsRef.current.has(round)) return;
        recordedRoundsRef.current.add(round);

        const next: [number, number] = [...scoresRef.current];
        if (res.winnerTeam !== undefined) {
          next[res.winnerTeam] += res.points;
        }
        scoresRef.current = next;
        setScores(next);
        setRoundHistory((prev) => [
          ...prev,
          {
            roundNumber: prev.length + 1,
            kind: res.kind,
            winnerTeam: res.winnerTeam,
            points: res.points,
            ourTotal: next[0],
            theirTotal: next[1],
          },
        ]);
        setPendingResult({
          result: res,
          ourTotal: next[0],
          theirTotal: next[1],
        });
      }, RESULT_DELAY_MS);
      return;
    }

    const seat = round.turn;
    const moves = round.legalMoves();

    if (moves.length === 0) {
      const canDraw = round.playerCount === 2 && round.boneyard.length > 0;
      setStatus({
        seat,
        kind: canDraw ? 'draws' : isFour ? 'noTiles' : 'passes',
      });

      actionTimerRef.current = window.setTimeout(
        () => {
          if (round.playerCount === 2 && round.boneyard.length > 0) {
            round.draw();
          } else {
            round.pass();
          }
          setBoardVersion((v) => v + 1);
          advanceRef.current();
        },
        canDraw ? DRAW_DELAY_MS : PASS_DELAY_MS
      );
      return;
    }

    setStatus(null);
    if (seat === 0) {
      setMyMoves(moves);
      setSecondsLeft(TURN_SECONDS);
      let left = TURN_SECONDS;
      turnIntervalRef.current = window.setInterval(() => {
        left -= 1;
        setSecondsLeft(left);
        if (left <= 0) {
          if (turnIntervalRef.current !== null) {
            window.clearInterval(turnIntervalRef.current);
            turnIntervalRef.current = null;
          }
          const currentRound = roundRef.current;
          if (!currentRound.isOver && currentRound.turn === 0) {
            const currentMoves = currentRound.legalMoves();
            if (currentMoves.length > 0) {
              const autoMove =
                currentMoves[Math.floor(Math.random() * currentMoves.length)];
              clearInteraction();
              executePlay(autoMove);
            }
          }
        }
      }, 1000);
    } else {
      actionTimerRef.current = window.setTimeout(() => {
        const aiMove = moves[Math.floor(Math.random() * moves.length)];
        executePlay(aiMove);
      }, AI_DELAY_MS);
    }
  }, [clearInteraction, clearTimers, executePlay, isFour]);

  advanceRef.current = advance;

  useEffect(() => {
    advance();
    return () => {
      clearTimers();
    };
  }, [advance, clearTimers]);

  // Measure table & hand area sizes
  useEffect(() => {
    const tableEl = tableAreaRef.current;
    const handEl = handScrollRef.current;
    const obs = new ResizeObserver(() => {
      if (tableEl) {
        const r = tableEl.getBoundingClientRect();
        setTableSize({ width: r.width, height: r.height });
      }
      if (handEl) {
        const r = handEl.getBoundingClientRect();
        setHandAreaWidth(r.width);
      }
    });
    if (tableEl) obs.observe(tableEl);
    if (handEl) obs.observe(handEl);
    return () => obs.disconnect();
  }, []);

  const handleNextRound = () => {
    if (!pendingResult) return;
    const last = pendingResult.result;
    setPendingResult(null);
    clearInteraction();

    if (last.kind === 'burned' || last.winnerSeat === undefined) {
      roundRef.current = roundFromSetup(Dealer.dealFirstRound(playerCount));
    } else {
      const dealt = Dealer.deal(playerCount);
      roundRef.current = new RoundState({
        playerCount,
        hands: dealt.hands,
        boneyard: dealt.boneyard,
        startSeat: last.winnerSeat,
      });
    }
    setBoardVersion((v) => v + 1);
    advance();
  };

  const handleRedeal = () => {
    clearInteraction();
    setPendingResult(null);
    roundRef.current = roundFromSetup(Dealer.dealFirstRound(playerCount));
    setBoardVersion((v) => v + 1);
    advance();
  };

  // Player actions
  const isPlayable = useCallback(
    (piece: DominoPiece) => myMoves.some((m) => pieceEquals(m.piece, piece)),
    [myMoves]
  );

  const endsForPiece = useCallback(
    (piece: DominoPiece): BoardEnd[] =>
      myMoves
        .filter((m) => pieceEquals(m.piece, piece))
        .map((m) => m.end),
    [myMoves]
  );

  const playMine = useCallback(
    (piece: DominoPiece, end: BoardEnd) => {
      const move: Move = { piece, end };
      if (roundRef.current.turn !== 0) return;
      if (!myMoves.some((m) => moveEquals(m, move))) return;
      clearInteraction();
      executePlay(move);
    },
    [clearInteraction, executePlay, myMoves]
  );

  const handleTapPiece = useCallback(
    (piece: DominoPiece) => {
      const ends = endsForPiece(piece);
      if (ends.length === 0) return;
      if (ends.length === 1) {
        playMine(piece, ends[0]);
        return;
      }
      setSelected((prev) => (prev && pieceEquals(prev, piece) ? null : piece));
    },
    [endsForPiece, playMine]
  );

  // Nearest end calculation during drag
  const nearestEndToPoint = useCallback(
    (x: number, y: number, ends: BoardEnd[]): BoardEnd => {
      let best = ends[0];
      let bestDist = Number.POSITIVE_INFINITY;
      for (const end of ends) {
        const el =
          end === 'left' ? leftSlotRef.current : rightSlotRef.current;
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(cx - x, cy - y);
        if (dist < bestDist) {
          bestDist = dist;
          best = end;
        }
      }
      return best;
    },
    []
  );

  // Pointer drag handling
  const pointerTrackRef = useRef<{
    piece: DominoPiece;
    pointerId: number;
    startX: number;
    startY: number;
    dragging: boolean;
    hasLeftHand: boolean;
  } | null>(null);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const track = pointerTrackRef.current;
      if (!track || e.pointerId !== track.pointerId) return;

      const dx = e.clientX - track.startX;
      const dy = e.clientY - track.startY;

      if (!track.dragging) {
        // Start drag on deliberate vertical lift (so horizontal swipe can scroll)
        if (Math.abs(dy) > 8 && Math.abs(dy) >= Math.abs(dx) * 0.85) {
          track.dragging = true;
          setSelected(null);
        } else {
          return;
        }
      }

      const handRect = handScrollRef.current?.getBoundingClientRect();
      const liftedThreshold = handRect
        ? handRect.top + handRect.height * 0.35
        : track.startY - 12;
      if (e.clientY < liftedThreshold) {
        track.hasLeftHand = true;
      }
      const overHand =
        track.hasLeftHand &&
        handRect !== undefined &&
        e.clientY >= handRect.top - 4;

      setDragSession({
        piece: track.piece,
        x: e.clientX,
        y: e.clientY,
        overHand,
      });

      const zoneRect = boardZoneRef.current?.getBoundingClientRect();
      if (
        zoneRect &&
        e.clientX >= zoneRect.left &&
        e.clientX <= zoneRect.right &&
        e.clientY >= zoneRect.top &&
        e.clientY <= zoneRect.bottom
      ) {
        const ends = endsForPiece(track.piece);
        if (ends.length === 1) {
          setHoverEnd(ends[0]);
        } else if (ends.length > 1) {
          setHoverEnd(nearestEndToPoint(e.clientX, e.clientY, ends));
        } else {
          setHoverEnd(null);
        }
      } else {
        setHoverEnd(null);
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      const track = pointerTrackRef.current;
      if (!track || e.pointerId !== track.pointerId) return;
      pointerTrackRef.current = null;

      if (!track.dragging) {
        handleTapPiece(track.piece);
        return;
      }

      const zoneRect = boardZoneRef.current?.getBoundingClientRect();
      const insideBoard =
        zoneRect &&
        e.clientX >= zoneRect.left &&
        e.clientX <= zoneRect.right &&
        e.clientY >= zoneRect.top &&
        e.clientY <= zoneRect.bottom;

      const ends = endsForPiece(track.piece);
      if (insideBoard && ends.length > 0) {
        const targetEnd =
          ends.length === 1
            ? ends[0]
            : nearestEndToPoint(e.clientX, e.clientY, ends);
        playMine(track.piece, targetEnd);
      } else {
        setDragSession(null);
        setHoverEnd(null);
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [endsForPiece, handleTapPiece, nearestEndToPoint, playMine]);

  const startTilePointerDown = (
    e: React.PointerEvent,
    piece: DominoPiece
  ) => {
    if (!isPlayable(piece)) return;
    pointerTrackRef.current = {
      piece,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      dragging: false,
      hasLeftHand: false,
    };
  };

  // Helpers for text
  const round = roundRef.current;
  const turnSeat = round.isOver ? null : round.turn;

  const seatName = (seat: number): string => {
    if (seat === 0) return l10n.playerYou;
    if (!isFour) return l10n.opponentSingle;
    switch (seat) {
      case 1:
        return l10n.opponentRight;
      case 2:
        return l10n.playerPartner;
      default:
        return l10n.opponentLeft;
    }
  };

  const startMessage = (): string => {
    const seat = round.startSeat;
    const forced = round.openingPiece;
    if (forced) {
      const pieceStr = formatPiece(forced);
      return seat === 0
        ? l10n.youStartRound(pieceStr)
        : l10n.otherStartsRound(seatName(seat), pieceStr);
    }
    return seat === 0
      ? l10n.youStartRoundFree
      : l10n.otherStartsRoundFree(seatName(seat));
  };

  const statusText = status
    ? (() => {
        const name = seatName(status.seat);
        if (status.kind === 'noTiles') return l10n.saysNoTiles(name);
        if (status.kind === 'passes') return l10n.passesTurn(name);
        return l10n.drawsTile(name);
      })()
    : null;

  // Rectangular (tall) board geometry maximizing vertical space while leaving
  // side wood margins in 2-player mode and space for side docks in 4-player mode.
  const sideDockWidth = isFour
    ? Math.min(82, Math.max(58, Math.round(tableSize.width * 0.155)))
    : 0;
  const twoPlayerSideMargin = Math.max(
    BOARD_SIDE_MARGIN,
    Math.round(tableSize.width * 0.055)
  );
  const sideReserve = isFour
    ? sideDockWidth + SIDE_EDGE_MARGIN + SIDE_BOARD_GAP
    : twoPlayerSideMargin;
  const availableWidth = Math.max(120, tableSize.width - 2 * sideReserve);
  const boardHeight = Math.max(
    120,
    Number.isFinite(tableSize.height) && tableSize.height > 0
      ? tableSize.height - TOP_RESERVE - BOARD_BOTTOM_GAP
      : 300
  );
  const maxPortraitWidth = Math.max(
    120,
    Math.round(boardHeight * (isFour ? 0.92 : 0.88))
  );
  const boardWidth = Math.max(120, Math.min(availableWidth, maxPortraitWidth));
  const boardLeft = Math.max(0, (tableSize.width - boardWidth) / 2);
  const boardTop = TOP_RESERVE;

  // Ghost slot states
  const ghostPiece = dragSession?.piece ?? selected;
  const activeEnds = ghostPiece ? endsForPiece(ghostPiece) : [];
  const litEnds = new Set<BoardEnd>(
    dragSession ? (hoverEnd ? [hoverEnd] : []) : activeEnds
  );

  // Hand tiles sorted
  const myHand = [...round.hands[0]].sort(comparePieces);
  const myTurn = turnSeat === 0;
  const timerOn = myTurn && myMoves.length > 0;
  const handTileWidth = Math.min(32, Math.max(24, (handAreaWidth - 76) / 7.8));
  const totalBoneyard = isFour ? 0 : 14;

  return (
    <div className="w-full h-full flex flex-col select-none">
      <AppHeader
        compact
        title={isFour ? l10n.modeFourPlayers : l10n.modeTwoPlayers}
        onBack={onBack}
        action={
          <button
            type="button"
            onClick={handleRedeal}
            title={l10n.redeal}
            aria-label={l10n.redeal}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        }
      />

      <div className="flex-1 min-h-0">
        <WoodTable>
          {/* Middle table area: always physical LTR coordinates */}
          <div
            ref={tableAreaRef}
            dir="ltr"
            className="relative flex-1 min-h-0 w-full overflow-hidden"
          >
            {/* Left of top player: Results history button */}
            <button
              type="button"
              onClick={() => setShowHistory(true)}
              style={{
                backgroundColor: 'rgba(29, 17, 10, 0.78)',
                border: '1px solid rgba(201, 162, 75, 0.32)',
              }}
              className="absolute top-1.5 left-2.5 px-2.5 py-1 rounded-xl flex flex-col items-center justify-center text-[#F5EFE0] hover:border-[#C9A24B] transition-colors cursor-pointer z-20"
            >
              <History className="w-4 h-4 text-[#C9A24B]" />
              <span className="mt-0.5 text-[10.5px] font-bold leading-none">
                {l10n.resultsButton}
              </span>
            </button>

            {/* Top player */}
            <div className="absolute top-1 inset-x-0 flex justify-center pointer-events-none z-10">
              <OpponentDock
                name={seatName(topSeat)}
                tileCount={round.hands[topSeat].length}
                isTurn={turnSeat === topSeat}
                skin={skin}
                orientation="horizontal"
                score={isFour ? scores[0] : scores[1]}
                targetScore={rules.targetScore}
              />
            </div>

            {/* Right of top player (2-player): Boneyard domino stack + remaining/total */}
            {!isFour && (
              <div
                style={{
                  backgroundColor: 'rgba(29, 17, 10, 0.78)',
                  border: '1px solid rgba(201, 162, 75, 0.28)',
                }}
                className="absolute top-1.5 right-2.5 px-2.5 py-1 rounded-xl flex flex-col items-center pointer-events-none z-10"
              >
                <div className="relative flex items-center justify-center">
                  {round.boneyard.length > 1 && (
                    <div
                      className="absolute translate-x-[2px] translate-y-[2px] opacity-65"
                      aria-hidden="true"
                    >
                      <DominoBack width={11} skin={skin} />
                    </div>
                  )}
                  <div className={round.boneyard.length === 0 ? 'opacity-30' : ''}>
                    <DominoBack width={11} skin={skin} />
                  </div>
                </div>
                <span
                  dir="ltr"
                  className="mt-1 text-[#F5EFE0] text-[10.5px] font-bold leading-none tabular-nums"
                >
                  {round.boneyard.length}/{totalBoneyard}
                </span>
              </div>
            )}

            {/* Left opponent (4 players) */}
            {isFour && tableSize.width > 0 && (
              <div
                style={{
                  left: Math.max(
                    SIDE_EDGE_MARGIN,
                    boardLeft - SIDE_BOARD_GAP - sideDockWidth
                  ),
                  top: boardTop,
                  width: sideDockWidth,
                  height: boardHeight,
                }}
                className="absolute flex items-center justify-center pointer-events-none z-10"
              >
                <OpponentDock
                  name={seatName(3)}
                  tileCount={round.hands[3].length}
                  isTurn={turnSeat === 3}
                  skin={skin}
                  orientation="vertical"
                  score={scores[1]}
                  targetScore={rules.targetScore}
                />
              </div>
            )}

            {/* Right opponent (4 players) */}
            {isFour && tableSize.width > 0 && (
              <div
                style={{
                  left: Math.min(
                    tableSize.width - SIDE_EDGE_MARGIN - sideDockWidth,
                    boardLeft + boardWidth + SIDE_BOARD_GAP
                  ),
                  top: boardTop,
                  width: sideDockWidth,
                  height: boardHeight,
                }}
                className="absolute flex items-center justify-center pointer-events-none z-10"
              >
                <OpponentDock
                  name={seatName(1)}
                  tileCount={round.hands[1].length}
                  isTurn={turnSeat === 1}
                  skin={skin}
                  orientation="vertical"
                  score={scores[1]}
                  targetScore={rules.targetScore}
                />
              </div>
            )}

            {/* Center rectangular framed board */}
            {tableSize.width > 0 && (
              <div
                ref={boardZoneRef}
                style={{
                  left: boardLeft,
                  top: boardTop,
                  width: boardWidth,
                  height: boardHeight,
                }}
                className="absolute"
              >
                <BoardFrame frameWidth={8}>
                  <div className="relative w-full h-full">
                    {round.board.isEmpty && !ghostPiece ? (
                      <div className="w-full h-full flex items-center justify-center p-3">
                        <div
                          style={{
                            backgroundColor: 'rgba(29, 17, 10, 0.80)',
                            border: '1px solid rgba(201, 162, 75, 0.30)',
                            borderRadius: 14,
                          }}
                          className="max-w-[240px] px-4 py-3 text-center text-[#F5EFE0] text-[14px]"
                        >
                          {startMessage()}
                        </div>
                      </div>
                    ) : (
                      <BoardView
                        board={round.board}
                        boardVersion={boardVersion}
                        skin={skin}
                        ghostDouble={ghostPiece ? isDouble(ghostPiece) : false}
                        activeEnds={activeEnds}
                        litEnds={litEnds}
                        onSlotTap={
                          selected
                            ? (end) => playMine(selected, end)
                            : undefined
                        }
                        leftSlotRef={leftSlotRef}
                        rightSlotRef={rightSlotRef}
                      />
                    )}

                    {statusText && (
                      <div className="pointer-events-none absolute bottom-1 inset-x-0 flex justify-center px-2">
                        <div
                          style={{
                            backgroundColor: 'rgba(29, 17, 10, 0.87)',
                            border: '1px solid rgba(201, 162, 75, 0.60)',
                          }}
                          className="max-w-[220px] px-3.5 py-1.5 rounded-full text-[#F5EFE0] text-[13px] font-bold text-center"
                        >
                          {statusText}
                        </div>
                      </div>
                    )}
                  </div>
                </BoardFrame>
              </div>
            )}
          </div>

          {/* Bottom area: your hand tiles above, your chip + score below */}
          <div className="pt-0.5 pb-1.5 shrink-0 flex flex-col items-center">
            <div
              ref={handScrollRef}
              dir="ltr"
              className="w-full overflow-x-auto"
              style={{ height: handTileWidth * 2 + 16 }}
            >
              <div className="min-w-full w-max h-full flex items-center justify-center px-3 pt-2 pb-1">
                {myHand.map((piece) => {
                  const playable = isPlayable(piece);
                  const dimmed = myTurn && !playable;
                  const isSel =
                    selected !== null && pieceEquals(selected, piece);
                  const isBeingDragged =
                    dragSession !== null &&
                    pieceEquals(dragSession.piece, piece);
                  const slotCollapsed =
                    isBeingDragged && !(dragSession?.overHand ?? false);
                  const slotReceiving =
                    isBeingDragged && (dragSession?.overHand ?? false);

                  return (
                    <div
                      key={`${piece.low}-${piece.high}`}
                      onPointerDown={(e) => startTilePointerDown(e, piece)}
                      style={{
                        width: slotCollapsed ? 0 : handTileWidth,
                        height: handTileWidth * 2,
                        marginLeft: slotCollapsed ? 0 : 3,
                        marginRight: slotCollapsed ? 0 : 3,
                        overflow: isBeingDragged ? 'hidden' : 'visible',
                        touchAction: playable ? 'pan-x' : 'auto',
                        transform: isSel
                          ? 'translateY(-12%)'
                          : slotCollapsed
                            ? 'scale(0.85)'
                            : 'translateY(0)',
                        transition:
                          'width 260ms cubic-bezier(0.22, 1.28, 0.36, 1), margin 260ms cubic-bezier(0.22, 1.28, 0.36, 1), transform 220ms cubic-bezier(0.22, 1.28, 0.36, 1)',
                        borderRadius: handTileWidth * 0.16,
                      }}
                      className={`relative shrink-0 ${
                        playable ? 'cursor-pointer' : 'cursor-default'
                      }`}
                    >
                      {slotReceiving && (
                        <div
                          style={{
                            borderRadius: handTileWidth * 0.16,
                            border: '1.5px dashed rgba(201, 162, 75, 0.65)',
                            backgroundColor: 'rgba(201, 162, 75, 0.12)',
                          }}
                          className="absolute inset-0 pointer-events-none"
                        />
                      )}
                      <div
                        style={{
                          opacity: isBeingDragged ? 0 : dimmed ? 0.4 : 1,
                          transition: 'opacity 160ms ease',
                          borderRadius: handTileWidth * 0.16,
                          boxShadow:
                            playable && !isBeingDragged
                              ? '0 0 12px 1px rgba(201, 162, 75, 0.85)'
                              : 'none',
                        }}
                      >
                        <DominoTile
                          top={piece.low}
                          bottom={piece.high}
                          width={handTileWidth}
                          skin={skin}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-0.5">
              <PlayerChip
                name={l10n.playerYou}
                tileCount={myHand.length}
                isTurn={myTurn}
                secondsLeft={timerOn ? secondsLeft : null}
                secondsTotal={TURN_SECONDS}
                score={scores[0]}
                targetScore={rules.targetScore}
                compact
              />
            </div>
          </div>
        </WoodTable>
      </div>

      {/* Dragging feedback tile following pointer */}
      {dragSession && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left: dragSession.x - FEEDBACK_WIDTH / 2,
            top: dragSession.y - FEEDBACK_WIDTH,
          }}
        >
          <DominoTile
            top={dragSession.piece.low}
            bottom={dragSession.piece.high}
            width={FEEDBACK_WIDTH}
            skin={skin}
          />
        </div>
      )}

      {/* Round Result Dialog */}
      {pendingResult && (
        <RoundResultDialog
          kind={pendingResult.result.kind}
          weWon={pendingResult.result.winnerTeam === 0}
          points={pendingResult.result.points}
          ourTotal={pendingResult.ourTotal}
          theirTotal={pendingResult.theirTotal}
          onNextRound={handleNextRound}
        />
      )}

      {/* Round History Dialog */}
      {showHistory && (
        <RoundHistoryDialog
          entries={roundHistory}
          ourLabel={isFour ? l10n.teamUs : l10n.playerYou}
          theirLabel={isFour ? l10n.teamThem : l10n.opponentSingle}
          ourTotal={scores[0]}
          theirTotal={scores[1]}
          targetScore={rules.targetScore}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
};
