import React, { useEffect, useState } from 'react';
import { Play, Sparkles, Volume2, ArrowDown } from 'lucide-react';

interface CinematicIntroProps {
  onEnter: () => void;
  isVisible: boolean;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onEnter, isVisible }) => {
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Also trigger on wheel or touch if intro is active
    const handleInitialGesture = (e: Event) => {
      if (isVisible && !hasStarted) {
        setHasStarted(true);
        onEnter();
      }
    };

    window.addEventListener('wheel', handleInitialGesture, { once: true, passive: true });
    window.addEventListener('touchmove', handleInitialGesture, { once: true, passive: true });

    return () => {
      window.removeEventListener('wheel', handleInitialGesture);
      window.removeEventListener('touchmove', handleInitialGesture);
    };
  }, [isVisible, hasStarted, onEnter]);

  if (!isVisible) return null;

  const handleButtonClick = () => {
    setHasStarted(true);
    onEnter();
  };

  return (
    <div
      onClick={handleButtonClick}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-[#0b0806]/90 backdrop-blur-md transition-opacity duration-1000 select-none cursor-pointer ${
        hasStarted ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Subtle Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,155,99,0.12)_0%,rgba(11,8,6,0.95)_70%)] pointer-events-none" />

      {/* Atmospheric Central Frame */}
      <div className="relative z-10 max-w-xl text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c130d] border border-[#c59b63]/40 text-[#c59b63] font-mono-tech text-[10px] tracking-widest mb-6">
          <Sparkles className="w-3 h-3 animate-pulse text-[#e6c594]" />
          <span>AEVRNN // CONTINUOUS 3D DIGITAL REEL</span>
        </div>

        <h1 className="font-display text-5xl sm:text-7xl font-black tracking-tight text-white mb-3">
          AEVRNN<span className="text-[#c59b63]">.</span>
        </h1>

        <p className="font-mono-tech text-xs sm:text-sm tracking-widest text-[#d6c7ba] uppercase mb-2">
          BUILD  •  EDIT  •  CREATE
        </p>

        <p className="font-mono-tech text-[11px] text-[#9c8b7f] tracking-wider mb-8 max-w-md">
          MINECRAFT SYSTEMS  •  DISCORD ARCHITECTURE  •  MOTION VFX  •  WEBGL
        </p>

        {/* Enter Button */}
        <button
          onClick={handleButtonClick}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#c59b63] via-[#d4af37] to-[#8c6239] text-[#0b0806] font-mono-tech font-bold text-xs tracking-widest uppercase border border-[#f3deb9] shadow-[0_0_30px_rgba(197,155,99,0.4)] hover:shadow-[0_0_50px_rgba(197,155,99,0.7)] transition-all transform hover:scale-105 active:scale-95"
        >
          <Play className="w-4 h-4 fill-current transition-transform group-hover:translate-x-0.5" />
          <span>INITIALIZE 3D EXPERIENCE</span>
        </button>

        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-[#8c6239] font-mono-tech text-[10px] tracking-widest">
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            <span>OR SCROLL / TOUCH TO FLY FORWARD</span>
          </div>
          <div className="flex items-center gap-2 text-[#e6c594] font-mono-tech text-[10px] tracking-wider mt-1 bg-[#1c130d]/90 px-3.5 py-1.5 rounded-full border border-[#c59b63]/40 shadow-lg">
            <Volume2 className="w-3.5 h-3.5 text-[#c59b63] animate-pulse" />
            <span>FEATURING SOUNDTRACK: CHARLIE PUTH // ATTENTION</span>
          </div>
        </div>
      </div>
    </div>
  );
};
