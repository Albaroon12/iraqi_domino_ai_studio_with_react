import React from 'react';

export interface BoardFrameProps {
  children: React.ReactNode;
  frameWidth?: number;
  feltLight?: string;
  feltDark?: string;
  frameLight?: string;
  frameDark?: string;
}

/**
 * The playing surface: carved wooden frame, thin gold line, and green felt inside.
 */
export const BoardFrame: React.FC<BoardFrameProps> = ({
  children,
  frameWidth = 10,
  feltLight = '#2A6B47',
  feltDark = '#123824',
  frameLight = '#7A5030',
  frameDark = '#2A180D',
}) => {
  return (
    <div
      className="w-full h-full"
      style={{
        borderRadius: 18,
        background: `linear-gradient(135deg, ${frameLight}, ${frameDark})`,
        border: '1.5px solid #140A05',
        boxShadow: '0 8px 18px rgba(0, 0, 0, 0.6)',
        padding: frameWidth,
      }}
    >
      <div
        className="w-full h-full overflow-hidden relative"
        style={{
          borderRadius: 8,
          border: '1.5px solid rgba(201, 162, 75, 0.85)',
          background: `radial-gradient(ellipse at center, ${feltLight} 0%, ${feltDark} 95%)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
