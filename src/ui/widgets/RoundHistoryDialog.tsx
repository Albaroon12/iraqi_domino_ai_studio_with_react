import React from 'react';
import { Flame, History, Trophy, X } from 'lucide-react';
import { RoundEndKind } from '../../engine/roundResult';
import { useSettings } from '../../state/settingsContext';
import { GameButton } from './GameButton';

export interface RoundHistoryEntry {
  readonly roundNumber: number;
  readonly kind: RoundEndKind;
  readonly winnerTeam?: number;
  readonly points: number;
  readonly ourTotal: number;
  readonly theirTotal: number;
}

export interface RoundHistoryDialogProps {
  entries: readonly RoundHistoryEntry[];
  ourLabel: string;
  theirLabel: string;
  ourTotal: number;
  theirTotal: number;
  targetScore: number;
  onClose: () => void;
}

/**
 * Modal showing the score and outcome of every previous round from the start of the match.
 */
export const RoundHistoryDialog: React.FC<RoundHistoryDialogProps> = ({
  entries,
  ourLabel,
  theirLabel,
  ourTotal,
  theirTotal,
  targetScore,
  onClose,
}) => {
  const { l10n } = useSettings();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-5"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(180deg, #3A2515 0%, #1D110A 100%)',
          border: '1px solid rgba(201, 162, 75, 0.60)',
          borderRadius: 20,
        }}
        className="w-full max-w-[360px] max-h-[80vh] p-5 flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[#C9A24B]">
            <History className="w-5 h-5" />
            <h2 className="text-[18px] font-bold">{l10n.resultsHistoryTitle}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={l10n.closeLabel}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#F5EFE0]/80 hover:bg-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current cumulative match summary */}
        <div
          style={{
            backgroundColor: 'rgba(14, 7, 3, 0.55)',
            border: '1px solid rgba(201, 162, 75, 0.25)',
          }}
          className="mt-3 px-3 py-2 rounded-xl flex items-center justify-between text-center tabular-nums"
        >
          <div className="flex-1">
            <div className="text-[11px] text-[#F5EFE0]/75">{ourLabel}</div>
            <div dir="ltr" className="text-[17px] font-extrabold text-[#F5EFE0]">
              {ourTotal}{' '}
              <span className="text-[11px] font-semibold text-[#C9A24B]">
                / {targetScore}
              </span>
            </div>
          </div>
          <div className="px-2 text-[#C9A24B]/70 text-xs font-bold">vs</div>
          <div className="flex-1">
            <div className="text-[11px] text-[#F5EFE0]/75">{theirLabel}</div>
            <div dir="ltr" className="text-[17px] font-extrabold text-[#F5EFE0]">
              {theirTotal}{' '}
              <span className="text-[11px] font-semibold text-[#C9A24B]">
                / {targetScore}
              </span>
            </div>
          </div>
        </div>

        {/* List of completed rounds */}
        <div className="mt-3 flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 pr-0.5">
          {entries.length === 0 ? (
            <div className="py-8 text-center text-[#F5EFE0]/65 text-sm">
              {l10n.noRoundsYet}
            </div>
          ) : (
            entries.map((entry) => {
              const burned = entry.kind === 'burned';
              const weWon = entry.winnerTeam === 0;
              const winnerText = burned
                ? l10n.roundBurned
                : weWon
                  ? `${ourLabel} +${entry.points}`
                  : `${theirLabel} +${entry.points}`;

              return (
                <div
                  key={entry.roundNumber}
                  style={{
                    backgroundColor: 'rgba(29, 17, 10, 0.72)',
                    border: '1px solid rgba(201, 162, 75, 0.22)',
                  }}
                  className="px-3 py-2 rounded-xl flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {burned ? (
                      <Flame className="w-4 h-4 text-[#C9A24B]/80 shrink-0" />
                    ) : (
                      <Trophy
                        className={`w-4 h-4 shrink-0 ${
                          weWon ? 'text-[#C9A24B]' : 'text-[#F5EFE0]/50'
                        }`}
                      />
                    )}
                    <div className="min-w-0">
                      <div className="text-[12px] font-bold text-[#F5EFE0]">
                        {l10n.roundNumberLabel(entry.roundNumber)}
                      </div>
                      <div
                        className={`text-[11.5px] font-semibold truncate ${
                          burned
                            ? 'text-[#F5EFE0]/70'
                            : weWon
                              ? 'text-[#C9A24B]'
                              : 'text-[#F5EFE0]/85'
                        }`}
                      >
                        {winnerText}
                      </div>
                    </div>
                  </div>

                  <div className="text-[12px] font-bold text-[#F5EFE0] tabular-nums shrink-0">
                    {entry.ourTotal} - {entry.theirTotal}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-4">
          <GameButton label={l10n.closeLabel} onClick={onClose} />
        </div>
      </div>
    </div>
  );
};
