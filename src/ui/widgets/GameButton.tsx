import React from 'react';

export interface GameButtonProps {
  label: string;
  subtitle?: string;
  icon?: React.ReactNode;
  primary?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * The game's standard button: dark wood or gold gradient, with a gold border.
 */
export const GameButton: React.FC<GameButtonProps> = ({
  label,
  subtitle,
  icon,
  primary = false,
  disabled = false,
  onClick,
  className = '',
}) => {
  const isDisabled = disabled || !onClick;
  const foreground = primary ? '#2B1B12' : '#F5EFE0';
  const background = primary
    ? 'linear-gradient(180deg, #E2BC62 0%, #A57F2B 100%)'
    : 'linear-gradient(180deg, #4A3020 0%, #2B1B12 100%)';

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      style={{
        background,
        color: foreground,
        border: '1.5px solid rgba(201, 162, 75, 0.70)',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.40)',
        borderRadius: 14,
      }}
      className={`w-full px-5 py-3.5 flex items-center justify-center gap-3 transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-[#C9A24B] ${
        isDisabled
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-pointer hover:brightness-105 active:scale-[0.99]'
      } ${className}`}
    >
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      <span className="flex flex-col items-center text-center min-w-0">
        <span className="text-lg font-bold leading-snug">{label}</span>
        {subtitle && (
          <span
            className="text-[13px] leading-snug whitespace-pre-line mt-0.5"
            style={{
              color: primary
                ? 'rgba(43, 27, 18, 0.78)'
                : 'rgba(245, 239, 224, 0.75)',
            }}
          >
            {subtitle}
          </span>
        )}
      </span>
    </button>
  );
};
