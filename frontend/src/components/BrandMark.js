import React from 'react';

/*
  BrandMark — FOT Student Hub emblem.
  A simple graduation-cap-over-open-book mark, used everywhere the app
  previously showed a plain "FOT / RJT" text placeholder.

  variant="gold" → gold gradient box, navy mark   (used on light/dark sidebars)
  variant="navy" → navy gradient box, gold mark   (used on login/register cards)
*/
const BrandMark = ({ size = 44, radius = 'rounded-xl', shadow = '', variant = 'gold' }) => {
  const isGold = variant === 'gold';
  const boxBg  = isGold
    ? 'linear-gradient(135deg, #c9a84c, #e8c96a)'
    : 'linear-gradient(135deg, #0d1b2a, #1a2b4a)';
  const markColor = isGold ? '#0d1b2a' : '#e8c96a';

  return (
    <div
      className={`${radius} flex items-center justify-center flex-shrink-0 ${shadow}`}
      style={{ width: size, height: size, background: boxBg }}
    >
      <svg viewBox="0 0 48 48" width={size * 0.6} height={size * 0.6} xmlns="http://www.w3.org/2000/svg">
        {/* Open book */}
        <path d="M5 17 L23 12.5 L23 34 L5 39 Z" fill={markColor} fillOpacity="0.95" />
        <path d="M43 17 L25 12.5 L25 34 L43 39 Z" fill={markColor} fillOpacity="0.65" />
        {/* Graduation cap */}
        <path d="M24 3 L45 11.5 L24 20 L3 11.5 Z" fill={markColor} />
        <circle cx="41.5" cy="15" r="2" fill={markColor} />
        <path d="M41.5 15 L41.5 23.5" stroke={markColor} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export default BrandMark;
