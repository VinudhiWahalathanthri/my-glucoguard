import React from 'react';
import { motion } from 'framer-motion';

interface AvatarDisplayProps {
  state: 'high' | 'mid' | 'low';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const avatarConfig = {
  high: { emoji: '😄', bg: 'gradient-success', label: 'Energetic!', anim: 'animate-float' },
  mid: { emoji: '😐', bg: 'gradient-accent', label: 'Neutral', anim: '' },
  low: { emoji: '😴', bg: 'gradient-danger', label: 'Low Energy', anim: 'animate-wiggle' },
};

const sizeMap = {
  sm: 'h-16 w-16 text-3xl',
  md: 'h-24 w-24 text-5xl',
  lg: 'h-32 w-32 text-7xl',
};

const AvatarDisplay = ({ state, size = 'md', showLabel = true }: AvatarDisplayProps) => {
  const config = avatarConfig[state];

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      <div className={`${sizeMap[size]} ${config.bg} ${config.anim} flex items-center justify-center rounded-full shadow-card`}>
        {config.emoji}
      </div>
      {showLabel && (
        <span className="text-sm font-semibold text-muted-foreground">{config.label}</span>
      )}
    </motion.div>
  );
};

export default AvatarDisplay;
