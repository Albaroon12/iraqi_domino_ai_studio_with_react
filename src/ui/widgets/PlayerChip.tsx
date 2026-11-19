import React from 'react';
import { User } from 'lucide-react';

export interface PlayerChipProps {
  name: string;
  tileCount: number;
  isTurn: boolean;
  secondsLeft?: number | null;
  secondsTotal?: number;
  score?: number;
  targetScore?: number;
  compact?: boolean;
}

/**
 * Player marker: circular avatar with tile-count badge, name, optional countdown ring,
 * and optional inline score readout.
 */
export const PlayerChip: React.FC<PlayerChipProps> = ({
  name,
  tileCount,
  isTurn,
  secondsLeft = null,
  secondsTotal = 30,
  score,
  targetScore,
  compact = false,
}) => {
  const hasTimer = secondsLeft !== null && secondsLeft !== undefined;
  const urgent = hasTimer && secondsLeft <= 10;
  const urgentColor = '#E5533D';

  const progress = hasTimer
    ? Math.max(0, Math.min(1, secondsLeft / Math.max(1, secondsTotal)))
    : 0;
  const ringRadius = compact ? 18 : 20;
  const ringBox = compact ? 40 : 44;
  const avatarSize = compact ? 30 : 34;
  const circumference = 2 * Math.PI * ringRadius;
  const dashOffset = circumference * (1 - progress);

  const avatar = (
    <div
      style={{ width: avatarSize, height: avatarSize }}
      className="relative flex items-center justify-center shrink-0"
    >
      {hasTimer && (
        <svg
          width={ringBox}
          height={ringBox}
          viewBox={`0 0 ${ringBox} ${ringBox}`}
          className="pointer-events-none absolute -inset-[5px] -rotate-90"
        >
          <circle
            cx={ringBox / 2}
            cy={ringBox / 2}
            r={ringRadius}
            fill="none"
            stroke="rgba(255,255,255,0.20)"
            strokeWidth={3}
          />
          <circle
            cx={ringBox / 2}
            cy={ringBox / 2}
            r={ringRadius}
            fill="none"
            stroke={urgent ? urgentColor : '#C9A24B'}
            strokeWidth={3}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.9s linear' }}
          />
        </svg>
      )}

      <div
        style={{
          width: avatarSize,
          height: avatarSize,
          backgroundColor: '#4A3020',
          borderColor: isTurn ? '#C9A24B' : 'rgba(201, 162, 75, 0.35)',
          borderWidth: isTurn ? 2.5 : 1.5,
          boxShadow: isTurn ? '0 0 12px rgba(201, 162, 75, 0.6)' : 'none',
        }}
        className="rounded-full border-solid flex items-center justify-center transition-all duration-200"
      >
        {urgent ? (
          <span
            className="text-[14px] font-extrabold leading-none tabular-nums"
            style={{ color: urgentColor }}
          >
            {secondsLeft}
          </span>
        ) : (
          <User className="w-4 h-4 text-[#F5EFE0]" />
        )}
      </div>

      <div
        style={{ backgroundColor: '#C9A24B', color: '#2B1B12' }}
        className="absolute -right-[6px] -bottom-[2px] min-w-[16px] h-[16px] px-1 rounded-[8px] flex items-center justify-center text-[10px] font-extrabold leading-none tabular-nums"
      >
        {tileCount}
      </div>
    </div>
  );

  if (compact) {
    return (
      <div
        style={{
          backgroundColor: 'rgba(29, 17, 10, 0.80)',
          border: isTurn
            ? '1px solid rgba(201, 162, 75, 0.78)'
            : '1px solid rgba(201, 162, 75, 0.28)',
          borderRadius: 999,
        }}
        className="inline-flex items-center gap-2.5 px-3 py-1 select-none"
      >
        {avatar}
        <span className="text-[#F5EFE0] text-[13px] font-bold leading-none">
          {name}
        </span>
        {score !== undefined && (
          <span
            dir="ltr"
            className="inline-flex items-baseline gap-1 px-2 py-0.5 rounded-full bg-[#C9A24B]/15 border border-[#C9A24B]/35 tabular-nums leading-none"
          >
            <span className="text-[#F5EFE0] text-[13px] font-extrabold">
              {score}
            </span>
            {targetScore !== undefined && (
              <span className="text-[#C9A24B] text-[10.5px] font-semibold">
                / {targetScore}
              </span>
            )}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center select-none">
      {avatar}
      <div
        style={{ backgroundColor: 'rgba(29, 17, 10, 0.67)' }}
        className="mt-1 max-w-[76px] px-1.5 py-0.5 rounded-lg"
      >
        <div className="text-[#F5EFE0] text-[12px] font-bold leading-tight text-center truncate">
          {name}
        </div>
      </div>
    </div>
  );
};
