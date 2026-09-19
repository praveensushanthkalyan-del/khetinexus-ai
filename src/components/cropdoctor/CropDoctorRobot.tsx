import React from 'react';

export type RobotState = 'idle' | 'analyzing' | 'speaking' | 'alert' | 'success';

interface CropDoctorRobotProps {
  state?: RobotState;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatusBadge?: boolean;
  statusText?: string;
  className?: string;
}

export const CropDoctorRobot: React.FC<CropDoctorRobotProps> = ({
  state = 'idle',
  size = 'md',
  showStatusBadge = false,
  statusText,
  className = '',
}) => {
  // Sizing mapping
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-20 h-20 sm:w-24 sm:h-24',
    xl: 'w-24 h-24 sm:w-28 sm:h-28',
  };

  const isAnalyzing = state === 'analyzing';
  const isSpeaking = state === 'speaking';
  const isAlert = state === 'alert';
  const isSuccess = state === 'success';

  return (
    <div className={`relative inline-flex items-center gap-2.5 ${className}`}>
      {/* CSS Keyframe animations embedded directly */}
      <style>{`
        @keyframes rob-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(1deg); }
        }
        @keyframes rob-leaf {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-5deg) skewX(-2deg); }
        }
        @keyframes rob-eye-blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        @keyframes rob-arm-left {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(8deg); }
        }
        @keyframes rob-arm-right {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-8deg); }
        }
        @keyframes rob-talking-mouth {
          0%, 100% { d: path("M38 56 Q50 60 62 56"); }
          50% { d: path("M38 56 Q50 66 62 56"); }
        }
        .rob-anim-float {
          animation: rob-float 4s ease-in-out infinite;
        }
        .rob-anim-leaf {
          animation: rob-leaf 3s ease-in-out infinite;
        }
        .rob-anim-eye {
          animation: rob-eye-blink 4s infinite;
          transform-origin: 38px 44px;
        }
        .rob-anim-eye-right {
          animation: rob-eye-blink 4s infinite;
          transform-origin: 62px 44px;
        }
        .rob-anim-arm-left {
          animation: rob-arm-left 2.5s ease-in-out infinite;
          transform-origin: 22px 64px;
        }
        .rob-anim-arm-right {
          animation: rob-arm-right 2.5s ease-in-out infinite;
          transform-origin: 78px 64px;
        }
        .rob-anim-mouth-talk {
          animation: rob-talking-mouth 0.4s ease-in-out infinite;
        }
      `}</style>

      {/* Robot SVG Container with floating & glow effects */}
      <div className={`relative ${sizeMap[size]} shrink-0 select-none rob-anim-float`}>
        {/* Subtle background aura glow */}
        <div
          className={`absolute -inset-1 rounded-full blur-md opacity-60 transition-all duration-700 ${
            isAnalyzing
              ? 'bg-emerald-400 dark:bg-emerald-500 animate-pulse'
              : isSpeaking
              ? 'bg-emerald-500/80 dark:bg-emerald-400/80 animate-ping opacity-30'
              : isAlert
              ? 'bg-amber-400 dark:bg-amber-500 animate-pulse'
              : isSuccess
              ? 'bg-teal-400 dark:bg-teal-500'
              : 'bg-emerald-400/20 dark:bg-emerald-600/20'
          }`}
        />

        {/* Chassis container */}
        <div className="relative w-full h-full p-1">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="robotBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#064e3b" />
                <stop offset="100%" stopColor="#022c22" />
              </linearGradient>
              <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="leafGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <filter id="eyeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Small Legs at the bottom (Robot Body Connection) */}
            <g className="transition-transform duration-500">
              {/* Left leg and foot */}
              <rect x="36" y="80" width="8" height="10" rx="4" fill="#047857" />
              <rect x="32" y="88" width="14" height="5" rx="2.5" fill="#064e3b" />
              {/* Right leg and foot */}
              <rect x="56" y="80" width="8" height="10" rx="4" fill="#047857" />
              <rect x="54" y="88" width="14" height="5" rx="2.5" fill="#064e3b" />
            </g>

            {/* Dual Leaf Antenna (Agricultural AI Leaves on Head) */}
            <g className="rob-anim-leaf origin-[50px_20px]">
              {/* Primary Leaf */}
              <path
                d="M50 20 Q48 8 52 2"
                stroke="#059669"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M52 2 C60 0 64 6 58 11 C52 15 50 8 52 2 Z"
                fill="url(#leafGrad)"
              />
              <path
                d="M52 2 Q55 6 57 10"
                stroke="#a7f3d0"
                strokeWidth="0.8"
                strokeLinecap="round"
              />

              {/* Secondary Companion Sprout Leaf */}
              <path
                d="M48 18 Q41 11 38 6"
                stroke="#059669"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M38 6 C32 5 30 10 35 14 C40 17 42 11 38 6 Z"
                fill="url(#leafGrad2)"
                opacity="0.9"
              />

              {/* Small Biosensor Node */}
              <circle cx="50" cy="20" r="2" fill="#10b981" />
            </g>

            {/* Left Hand & Arm */}
            <g className="rob-anim-arm-left">
              <path d="M22 62 Q12 64 10 70" stroke="#10b981" strokeWidth="3" strokeLinecap="round" fill="none" />
              <circle cx="10" cy="70" r="2.5" fill="#047857" />
            </g>

            {/* Right Hand & Arm */}
            <g className="rob-anim-arm-right">
              <path d="M78 62 Q88 64 90 70" stroke="#10b981" strokeWidth="3" strokeLinecap="round" fill="none" />
              <circle cx="90" cy="70" r="2.5" fill="#047857" />
            </g>

            {/* Left Ear Sensor */}
            <rect
              x="12"
              y="40"
              width="6"
              height="16"
              rx="3"
              fill="#065f46"
              className={isSpeaking ? 'animate-pulse' : ''}
            />

            {/* Right Ear Sensor */}
            <rect
              x="82"
              y="40"
              width="6"
              height="16"
              rx="3"
              fill="#065f46"
              className={isSpeaking ? 'animate-pulse' : ''}
            />

            {/* Main Robot Head/Face Chassis */}
            <rect
              x="18"
              y="22"
              width="64"
              height="52"
              rx="16"
              fill="#f0fdf4"
              stroke="#10b981"
              strokeWidth="2.5"
            />
            {/* Inner Highlight */}
            <rect
              x="21"
              y="25"
              width="58"
              height="14"
              rx="7"
              fill="#ffffff"
              fillOpacity="0.5"
            />

            {/* Visor Display Screen */}
            <rect
              x="24"
              y="32"
              width="52"
              height="34"
              rx="10"
              fill="url(#screenGrad)"
              stroke="#047857"
              strokeWidth="1.5"
            />

            {/* Subtle Grid Scanning line */}
            <line x1="28" y1="49" x2="72" y2="49" stroke="#065f46" strokeWidth="0.5" strokeDasharray="2 2" />

            {/* LED Glowing Eyes */}
            <g filter="url(#eyeGlow)">
              {/* Left Eye */}
              <circle
                cx="38"
                cy="44"
                r={isAlert ? '3.5' : '4'}
                fill={isAlert ? '#fbbf24' : '#34d399'}
                className="rob-anim-eye"
              />
              <circle cx="39.5" cy="42.5" r="1.2" fill="#ffffff" className="rob-anim-eye" />

              {/* Right Eye */}
              <circle
                cx="62"
                cy="44"
                r={isAlert ? '3.5' : '4'}
                fill={isAlert ? '#fbbf24' : '#34d399'}
                className="rob-anim-eye-right"
              />
              <circle cx="63.5" cy="42.5" r="1.2" fill="#ffffff" className="rob-anim-eye-right" />
            </g>

            {/* Smiling Face Mouth / Speech waveform / Thinking */}
            {isSpeaking ? (
              <path
                d="M38 56 Q50 64 62 56"
                stroke="#34d399"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                className="rob-anim-mouth-talk"
              />
            ) : isAnalyzing ? (
              // Thinking / Scanning Mouth Indicator
              <g>
                <rect x="36" y="56" width="28" height="3" rx="1.5" fill="#065f46" />
                <rect x="36" y="56" width="12" height="3" rx="1.5" fill="#34d399" />
              </g>
            ) : isAlert ? (
              // Alert Straight Line
              <line x1="40" y1="57" x2="60" y2="57" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            ) : (
              // Expressive Smiling mouth
              <path
                d="M38 56 Q50 63 62 56"
                stroke="#34d399"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* Small Cheek Rosiness for Polish */}
            <circle cx="30" cy="52" r="2" fill="#10b981" fillOpacity="0.3" />
            <circle cx="70" cy="52" r="2" fill="#10b981" fillOpacity="0.3" />

            {/* Collar Base Connector Plate */}
            <path
              d="M34 74 L66 74 L62 80 L38 80 Z"
              fill="#065f46"
              stroke="#047857"
              strokeWidth="0.8"
            />
            {/* LED indicator on body */}
            <circle
              cx="50"
              cy="77"
              r="1.8"
              fill={isAnalyzing ? '#34d399' : isAlert ? '#f59e0b' : '#10b981'}
              className="animate-pulse"
            />
          </svg>
        </div>
      </div>

      {/* Optional Status Badge / Title text */}
      {showStatusBadge && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-bold text-stone-900 dark:text-stone-100 text-xs sm:text-sm">
              KhetiNexus AI
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold uppercase tracking-wider border border-emerald-200/60 dark:border-emerald-800">
              Bot
            </span>
          </div>
          <span className="text-[11px] text-stone-500 dark:text-stone-400">
            {statusText || (isAnalyzing ? 'Thinking...' : isSpeaking ? 'Speaking...' : 'Agricultural Assistant')}
          </span>
        </div>
      )}
    </div>
  );
};
