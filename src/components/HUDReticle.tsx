import React, { useEffect, useState, useRef } from 'react';
import { ProjectItem } from '../data/portfolioData';

interface HUDReticleProps {
  activeProject: ProjectItem | null;
  currentProgress: number;
}

export const HUDReticle: React.FC<HUDReticleProps> = ({ activeProject, currentProgress }) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const reqId = useRef<number>(0);

  useEffect(() => {
    // Only show on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const render = () => {
      // Smooth lerp for tactile targeting crosshair
      const dx = targetPos.current.x - currentPos.current.x;
      const dy = targetPos.current.y - currentPos.current.y;
      currentPos.current.x += dx * 0.22;
      currentPos.current.y += dy * 0.22;

      setPos({
        x: Math.round(currentPos.current.x),
        y: Math.round(currentPos.current.y),
      });

      reqId.current = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    reqId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(reqId.current);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const isLocked = Boolean(activeProject);

  return (
    <div
      className="pointer-events-none fixed z-30 transition-opacity duration-300 select-none hidden md:block"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Central Targeting Crosshair */}
      <div className="relative flex items-center justify-center">
        {/* Core Dot */}
        <div
          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
            isLocked ? 'bg-[#e6c594] shadow-[0_0_8px_#c59b63]' : 'bg-[#c59b63]/60'
          }`}
        />

        {/* Dynamic Brackets */}
        <div
          className={`absolute rounded transition-all duration-300 border ${
            isLocked
              ? 'w-14 h-14 border-[#c59b63] shadow-[0_0_15px_rgba(197,155,99,0.3)] rotate-45'
              : 'w-7 h-7 border-[#c59b63]/30 border-dashed rotate-0'
          }`}
        />

        {/* Corner Ticks */}
        <div className="absolute w-10 h-10 pointer-events-none">
          <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[#c59b63]/70" />
          <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-[#c59b63]/70" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-[#c59b63]/70" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-[#c59b63]/70" />
        </div>

        {/* Telemetry Tag Tagline */}
        <div className="absolute left-10 top-0 whitespace-nowrap flex flex-col font-mono-tech text-[9px] tracking-widest text-[#c59b63]/80 bg-[#140e0a]/80 backdrop-blur-sm px-2 py-0.5 rounded border border-[#c59b63]/25 shadow-md">
          {isLocked ? (
            <>
              <span className="text-white font-bold">
                LOCK // NODE {activeProject?.sectionNumber}
              </span>
              <span className="text-[#a8998d] text-[8px]">
                {activeProject?.title.toUpperCase()}
              </span>
            </>
          ) : (
            <>
              <span>SYS // TGT_SCAN</span>
              <span className="text-[#8c6239] text-[8px]">
                Z: {(currentProgress * 10).toFixed(1)}m
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
