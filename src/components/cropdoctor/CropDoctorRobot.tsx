import React, { useState } from 'react';
import mascotImage from '../../assets/crop_doctor_mascot.jpg';

export type RobotState = 'idle' | 'listening' | 'thinking' | 'analyzing' | 'speaking' | 'error' | 'alert';

export interface CropDoctorRobotProps {
  state?: RobotState;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  showStatusBadge?: boolean;
  statusText?: string;
  className?: string;
  onClick?: () => void;
}

export const CropDoctorRobot: React.FC<CropDoctorRobotProps> = ({
  state = 'idle',
  size = 'md',
  showStatusBadge = false,
  statusText,
  className = '',
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses: Record<string, string> = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8 sm:w-9 sm:h-9',
    md: 'w-10 h-10 sm:w-11 sm:h-11',
    lg: 'w-14 h-14 sm:w-16 sm:h-16',
    xl: 'w-20 h-20 sm:w-24 sm:h-24',
    '2xl': 'w-28 h-28 sm:w-32 sm:h-32',
    hero: 'w-36 h-36 sm:w-44 sm:h-44',
  };

  const isAnimated = state === 'analyzing' || state === 'thinking' || state === 'listening' || state === 'speaking';

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full transition-all select-none ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {/* Animated glow aura during active AI diagnosis or listening states */}
      {isAnimated && (
        <>
          <span className="absolute inset-0 rounded-full bg-emerald-500/25 dark:bg-emerald-400/30 animate-ping pointer-events-none" />
          <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-emerald-500/30 via-teal-500/20 to-lime-500/30 animate-pulse pointer-events-none" />
        </>
      )}

      {/* Official 3D Crop Doctor Bot Mascot Avatar Container */}
      <div className="relative w-full h-full rounded-full overflow-hidden bg-white dark:bg-[#07170e] border-2 border-emerald-500/40 dark:border-emerald-600/50 shadow-xs flex items-center justify-center">
        {!imgError ? (
          <img
            src={mascotImage}
            alt="Crop Doctor AI Bot Mascot"
            className={`w-full h-full object-contain object-center transition-transform ${isAnimated ? 'scale-105' : 'hover:scale-105'}`}
            onError={() => setImgError(true)}
            loading="eager"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-emerald-700 text-white font-black text-xs">
            🤖 CD
          </div>
        )}
      </div>

      {/* Optional Status Badge Overlay */}
      {showStatusBadge && statusText && (
        <span className="absolute -bottom-1 text-[9px] bg-emerald-800 text-white px-1.5 py-0.2 rounded-full font-bold shadow-xs whitespace-nowrap z-10 border border-emerald-600/60">
          {statusText}
        </span>
      )}
    </div>
  );
};
