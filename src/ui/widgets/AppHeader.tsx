import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useSettings } from '../../state/settingsContext';

export interface AppHeaderProps {
  title: string;
  onBack?: () => void;
  action?: React.ReactNode;
  compact?: boolean;
}

/** Top AppBar matching Flutter's walnut AppBar with centered title and back navigation. */
export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  onBack,
  action,
  compact = false,
}) => {
  const { isRtl } = useSettings();
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  return (
    <header
      className={`relative z-20 ${
        compact ? 'h-11 px-2.5' : 'h-14 px-3'
      } bg-[#2B1B12] text-[#F5EFE0] flex items-center justify-between border-b border-[#C9A24B]/15 shrink-0`}
    >
      <div className="w-9 flex items-center justify-start">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className={`${
              compact ? 'w-8 h-8' : 'w-10 h-10'
            } rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C9A24B]`}
          >
            <BackIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      <h1
        className={`${
          compact ? 'text-[16px]' : 'text-[19px]'
        } font-bold truncate text-center px-2`}
      >
        {title}
      </h1>
      <div className="w-9 flex items-center justify-end">{action}</div>
    </header>
  );
};
