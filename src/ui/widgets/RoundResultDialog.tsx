import React from 'react';
import { Flame, Frown, Trophy } from 'lucide-react';
import { RoundEndKind } from '../../engine/roundResult';
import { useSettings } from '../../state/settingsContext';
import { GameButton } from './GameButton';

export interface RoundResultDialogProps {
  kind: RoundEndKind;
  weWon: boolean;
  points: number;
  ourTotal: number;
  theirTotal: number;
  onNextRound: () => void;
}

/** Modal dialog showing the outcome of a completed round. */
export const RoundResultDialog: React.FC<RoundResultDialogProps> = ({
  kind,
  weWon,
  points,
  ourTotal,
  theirTotal,
  onNextRound,
}) => {
  const { l10n } = useSettings();
  const burned = kind === 'burned';

  const title = burned
    ? l10n.roundBurned
    : weWon
      ? l10n.weWonRound
      : l10n.theyWonRound;

  const reason =
    kind === 'domino'
      ? l10n.reasonDomino
      : kind === 'blocked'
        ? l10n.reasonBlocked
        : l10n.reasonBurned;

  const Icon = burned ? Flame : weWon ? Trophy : Frown;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          background: 'linear-gradient(180deg, #3A2515 0%, #1D110A 100%)',
          border: '1px solid rgba(201, 162, 75, 0.60)',
          borderRadius: 20,
        }}
        className="w-full max-w-[340px] p-6 flex flex-col items-center text-center shadow-2xl"
      >
        <Icon className="w-12 h-12 text-[#C9A24B]" />
        <h2 className="mt-3 text-[#C9A24B] text-[22px] font-bold">{title}</h2>
        <p className="mt-1.5 text-[#F5EFE0]/80 text-[14px]">{reason}</p>

        {!burned && (
          <div className="mt-4 text-[#F5EFE0] text-[20px] font-bold tabular-nums">
            {l10n.roundPoints(points)}
          </div>
        )}

        <div className="mt-3 text-[#F5EFE0]/80 text-[14px] tabular-nums">
          {l10n.totalsLine(ourTotal, theirTotal)}
        </div>

        <div className="mt-6 w-full">
          <GameButton label={l10n.nextRound} primary onClick={onNextRound} />
        </div>
      </div>
    </div>
  );
};
