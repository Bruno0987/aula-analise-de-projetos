import React, { useState } from 'react';
import { AvatarFrameId } from '../types/whatsapp';

interface AvatarWithFrameProps {
  src: string;
  alt: string;
  frameId?: AvatarFrameId;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isOnline?: boolean;
  isGif?: boolean;
  className?: string;
  onClick?: () => void;
  showBadge?: boolean;
}

const SIZE_MAP = {
  xs: { box: 'w-7 h-7', inner: 'w-7 h-7', text: 'text-[10px]', status: 'w-2 h-2' },
  sm: { box: 'w-9 h-9', inner: 'w-9 h-9', text: 'text-xs', status: 'w-2.5 h-2.5' },
  md: { box: 'w-12 h-12', inner: 'w-12 h-12', text: 'text-sm', status: 'w-3.5 h-3.5' },
  lg: { box: 'w-16 h-16', inner: 'w-16 h-16', text: 'text-base', status: 'w-4 h-4' },
  xl: { box: 'w-24 h-24', inner: 'w-24 h-24', text: 'text-xl', status: 'w-5 h-5' },
  '2xl': { box: 'w-32 h-32', inner: 'w-32 h-32', text: 'text-2xl', status: 'w-6 h-6' },
};

export const AvatarWithFrame: React.FC<AvatarWithFrameProps> = ({
  src,
  alt,
  frameId = 'none',
  size = 'md',
  isOnline,
  isGif = false,
  className = '',
  onClick,
  showBadge = true,
}) => {
  const [imageError, setImageError] = useState(false);
  const sizeConfig = SIZE_MAP[size];

  // Fallback initial
  const initial = alt ? alt.charAt(0).toUpperCase() : 'U';

  const renderFrameWrapper = (children: React.ReactNode) => {
    switch (frameId) {
      case 'rainbow':
        return (
          <div className={`frame-rainbow-container relative rounded-full flex items-center justify-center p-[3px] ${className}`}>
            <div className="frame-rainbow-spinner" />
            <div className="relative z-10 rounded-full bg-slate-900 overflow-hidden flex items-center justify-center">
              {children}
            </div>
          </div>
        );
      case 'cyber':
        return (
          <div className={`frame-cyber relative rounded-full overflow-hidden ${className}`}>
            {children}
          </div>
        );
      case 'gold':
        return (
          <div className={`frame-gold relative rounded-full overflow-hidden ${className}`}>
            {children}
          </div>
        );
      case 'pixel':
        return (
          <div className={`frame-pixel relative rounded-full overflow-hidden ${className}`}>
            {children}
          </div>
        );
      case 'fire':
        return (
          <div className={`frame-fire relative rounded-full overflow-hidden ${className}`}>
            {children}
          </div>
        );
      case 'diamond':
        return (
          <div className={`frame-diamond relative rounded-full overflow-hidden ${className}`}>
            {children}
          </div>
        );
      case 'hologram':
        return (
          <div className={`frame-hologram relative rounded-full overflow-hidden ${className}`}>
            {children}
          </div>
        );
      case 'floral':
        return (
          <div className={`frame-floral relative rounded-full overflow-hidden ${className}`}>
            {children}
          </div>
        );
      case 'none':
      default:
        return (
          <div className={`relative rounded-full overflow-hidden border border-black/10 dark:border-white/10 ${className}`}>
            {children}
          </div>
        );
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-block select-none ${onClick ? 'cursor-pointer' : ''}`}
    >
      {renderFrameWrapper(
        <div className={`${sizeConfig.inner} rounded-full overflow-hidden flex items-center justify-center bg-slate-200 dark:bg-zinc-800`}>
          {!imageError && src ? (
            <img
              src={src}
              alt={alt}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className={`font-semibold text-slate-700 dark:text-zinc-300 ${sizeConfig.text}`}>
              {initial}
            </span>
          )}
        </div>
      )}

      {/* GIF animated indicator tag if size is large */}
      {isGif && (size === 'lg' || size === 'xl' || size === '2xl') && (
        <span className="absolute -bottom-1 -right-1 bg-violet-600 text-white font-mono font-bold text-[9px] px-1.5 py-0.2 rounded-md shadow-sm border border-violet-400">
          GIF
        </span>
      )}

      {/* Online Status Dot */}
      {showBadge && isOnline !== undefined && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-zinc-900 ${
            isOnline ? 'bg-emerald-500' : 'bg-slate-400'
          } ${sizeConfig.status}`}
          title={isOnline ? 'Online' : 'Offline'}
        />
      )}
    </div>
  );
};
