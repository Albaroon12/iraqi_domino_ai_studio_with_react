import React from 'react';
import { useSettings } from '../../state/settingsContext';

export interface ScoreBoardProps {
  ourLabel: string;
  theirLabel: string;
  ourScore: number;
  theirScore: number;
  targetScore: number;
}

/** Shows both team/player scores and the target score. */
export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  ourLabel,
  theirLabel,
  ourScore,
  theirScore,
  targetScore,
}) => {
  const { l10n } = useSettings();

  return (
    <div
      style={{
        backgroundColor: 'rgba(29, 17, 10, 0.80)',
        border: '1px solid rgba(201, 162, 75, 0.30)',
        borderRadius: 14,
      }}
      className="mx-3 mt-1.5 px-3 py-1.5 flex items-center justify-between shrink-0"
    >
      <div className="flex-1 flex flex-col items-center">
        <span className="text-[#F5EFE0] text-[12px]">{ourLabel}</span>
        <span className="text-[#F5EFE0] text-[22px] font-bold leading-tight tabular-nums">
          {ourScore}
        </span>
      </div>

      <div className="flex flex-col items-center px-3">
        <span className="text-[#F5EFE0]/70 text-[11px]">{l10n.targetShort}</span>
        <span className="text-[#C9A24B] text-[17px] font-bold leading-tight tabular-nums">
          {targetScore}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center">
        <span className="text-[#F5EFE0] text-[12px]">{theirLabel}</span>
        <span className="text-[#F5EFE0] text-[22px] font-bold leading-tight tabular-nums">
          {theirScore}
        </span>
      </div>
    </div>
  );
};
