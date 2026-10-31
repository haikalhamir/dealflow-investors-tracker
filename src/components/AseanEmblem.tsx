import React from 'react';

interface AseanEmblemProps {
  className?: string;
  size?: number;
}

/**
 * Authentic stylized ASEAN Emblem symbol:
 * 10 golden paddy (rice) stalks bound together inside a circular crest,
 * symbolizing friendship, unity, and shared prosperity across Southeast Asia.
 */
export const AseanEmblem: React.FC<AseanEmblemProps> = ({ className = '', size = 26 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="ASEAN Emblem"
    >
      {/* Outer Blue Ring */}
      <circle cx="50" cy="50" r="48" fill="#003366" stroke="#FFFFFF" strokeWidth="2.5" />
      {/* Inner Red Disc */}
      <circle cx="50" cy="50" r="41" fill="#CC0000" />
      {/* Golden Paddy Stalks Sheaf */}
      <g fill="#FFCC00" stroke="#FFCC00" strokeWidth="0.5">
        {/* Central bundle stems */}
        <path d="M42 46 C42 34, 46 20, 50 16 C54 20, 58 34, 58 46 L58 78 C58 81, 42 81, 42 78 Z" />
        {/* Left spreading sheaf blades */}
        <path d="M37 48 C34 37, 39 24, 46 18 C44 26, 42 38, 43 50 Z" />
        <path d="M32 52 C28 42, 33 29, 41 22 C38 31, 37 43, 39 54 Z" />
        {/* Right spreading sheaf blades */}
        <path d="M63 48 C66 37, 61 24, 54 18 C56 26, 58 38, 57 50 Z" />
        <path d="M68 52 C72 42, 67 29, 59 22 C62 31, 63 43, 61 54 Z" />
        {/* Sheaf tie band */}
        <rect x="39" y="55" width="22" height="6.5" rx="2" fill="#FFFFFF" stroke="#003366" strokeWidth="1" />
      </g>
    </svg>
  );
};
