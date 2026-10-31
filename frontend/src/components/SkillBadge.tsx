import React from 'react';
import { Check, X, AlertCircle, Sparkles } from 'lucide-react';

interface SkillBadgeProps {
  skill: string;
  variant: 'matched' | 'missing' | 'partial' | 'neutral' | 'critical';
  size?: 'sm' | 'md';
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({
  skill,
  variant,
  size = 'md',
}) => {
  const isSm = size === 'sm';

  const badgeStyles = {
    matched: 'badge-matched',
    missing: 'badge-missing',
    partial: 'badge-partial',
    neutral: 'badge-neutral',
    critical: 'bg-rose-950/40 text-rose-300 border border-rose-500/40',
  };

  const icons = {
    matched: <Check className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
    missing: <X className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
    partial: <AlertCircle className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
    neutral: null,
    critical: <Sparkles className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md transition-all ${
        badgeStyles[variant]
      } ${isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}`}
    >
      {icons[variant]}
      <span>{skill}</span>
    </span>
  );
};
