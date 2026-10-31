import React from 'react';

interface ScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showCategory?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 'md',
  label,
  showCategory = true,
}) => {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  // Determine color scheme based on score
  let strokeColor = '#f43f5e'; // red
  let glowColor = 'rgba(244, 63, 94, 0.4)';
  let categoryText = 'Deficit';
  let categoryColor = 'text-rose-400';

  if (clampedScore >= 85) {
    strokeColor = '#10b981'; // emerald
    glowColor = 'rgba(16, 185, 129, 0.5)';
    categoryText = 'Exceptional Match';
    categoryColor = 'text-emerald-400';
  } else if (clampedScore >= 70) {
    strokeColor = '#06b6d4'; // cyan
    glowColor = 'rgba(6, 182, 212, 0.5)';
    categoryText = 'Strong Fit';
    categoryColor = 'text-cyan-400';
  } else if (clampedScore >= 50) {
    strokeColor = '#f59e0b'; // amber
    glowColor = 'rgba(245, 158, 11, 0.5)';
    categoryText = 'Moderate Fit';
    categoryColor = 'text-amber-400';
  }

  // Dimensions
  const dim = size === 'sm' ? 80 : size === 'lg' ? 170 : 120;
  const strokeWidth = size === 'sm' ? 6 : size === 'lg' ? 12 : 9;
  const radius = (dim - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Foreground progress circle with glow */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out',
              filter: `drop-shadow(0 0 6px ${glowColor})`,
            }}
          />
        </svg>

        {/* Inner Score Number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-extrabold tracking-tight ${
              size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-4xl' : 'text-2xl'
            }`}
            style={{ color: strokeColor }}
          >
            {clampedScore}%
          </span>
          {label && (
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              {label}
            </span>
          )}
        </div>
      </div>

      {showCategory && (
        <span className={`mt-2 font-semibold text-xs tracking-wide ${categoryColor}`}>
          {categoryText}
        </span>
      )}
    </div>
  );
};
