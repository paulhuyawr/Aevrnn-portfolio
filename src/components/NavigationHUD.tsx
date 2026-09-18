import React from 'react';
import { ProjectItem, PORTFOLIO_DATA } from '../data/portfolioData';
import {
  Volume2,
  VolumeX,
  Compass,
  Eye,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Terminal,
  Film,
  Radio,
  Sliders,
  Play,
  Pause,
} from 'lucide-react';
import { ambientSynth } from '../utils/audioEngine';

interface NavigationHUDProps {
  currentProgress: number;
  activeProject: ProjectItem | null;
  onJumpToCategory: (category: string) => void;
  onOpenProjectModal: (project: ProjectItem) => void;
  onOpenContactModal: () => void;
  audioActive: boolean;
  onToggleAudio: () => void;
  onScrollStep: (direction: number) => void;
  onOpenTerminal: () => void;
  onOpenRadar: () => void;
  onOpenShowreel: () => void;
  onOpenFX: () => void;
  isAutopilot: boolean;
  onToggleAutopilot: () => void;
}

const CATEGORIES = [
  { id: 'intro', label: 'INTRO', index: 0 },
  { id: 'minecraft', label: '01 MINECRAFT', index: 1 },
  { id: 'discord', label: '02 DISCORD', index: 4 },
  { id: 'editing', label: '03 EDITING', index: 7 },
  { id: 'web', label: '04 WEB', index: 10 },
  { id: 'skills', label: '05 SKILLS', index: 13 },
  { id: 'about', label: '06 ABOUT', index: 14 },
  { id: 'contact', label: '07 CONTACT', index: 15 },
];

export const NavigationHUD: React.FC<NavigationHUDProps> = ({
  currentProgress,
  activeProject,
  onJumpToCategory,
  onOpenProjectModal,
  onOpenContactModal,
  audioActive,
  onToggleAudio,
  onScrollStep,
  onOpenTerminal,
  onOpenRadar,
  onOpenShowreel,
  onOpenFX,
  isAutopilot,
  onToggleAutopilot,
}) => {
  const [copiedIp, setCopiedIp] = React.useState(false);
  const totalNodes = PORTFOLIO_DATA.length + 1;
  const progressPercent = Math.min(100, Math.round((currentProgress / totalNodes) * 100));

  // Determine which category is currently in focal view
  const currentCategory = activeProject ? activeProject.category : currentProgress < 0.6 ? 'intro' : 'contact';

  const copyServerIp = () => {
    navigator.clipboard.writeText('zentramc.loca.lol');
    ambientSynth.playCopySuccess();
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2200);
  };

  const handleStep = (direction: number) => {
    ambientSynth.playNodeWarp();
    onScrollStep(direction);
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex flex-col justify-between p-3 sm:p-5 md:p-6 select-none">
      {/* Top Header Navigation */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Telemetry */}
          <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onJumpToCategory('intro')}
              className="group text-left flex items-center gap-2.5 sm:gap-3 bg-[#17100b]/85 backdrop-blur-md px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border border-[#c59b63]/30 hover:border-[#c59b63] transition-all"
              title="Return to Intro Core"
            >
              <span className="font-display font-black text-lg sm:text-xl tracking-wider text-white group-hover:text-[#f0ddc2] transition-colors">
                AEVRNN<span className="text-[#c59b63]">.</span>
              </span>
              <div className="hidden sm:flex flex-col border-l border-[#c59b63]/30 pl-2.5">
                <span className="font-mono-tech text-[9px] tracking-widest text-[#c59b63] uppercase">
                  3D REEL // RUNTIME
                </span>
                <span className="font-mono-tech text-[10px] text-[#a8998d]">
                  AURITRA PAUL
                </span>
              </div>
            </button>
          </div>

          {/* Warp Section Links (Desktop) */}
          <nav className="pointer-events-auto hidden xl:flex items-center gap-1 bg-[#140e0a]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#c59b63]/25 shadow-lg">
            {CATEGORIES.map((cat) => {
              const isActive = currentCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onJumpToCategory(cat.id)}
                  className={`px-3 py-1 text-xs font-mono-tech tracking-wider rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-[#c59b63] text-[#0b0806] font-bold shadow-[0_0_12px_rgba(197,155,99,0.5)]'
                      : 'text-[#d6c7ba] hover:text-[#f5ede6] hover:bg-[#2a1d15]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </nav>

          {/* Action & Utility Controls (Right) */}
          <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
            {/* Autopilot Drone Toggle */}
            <button
              onClick={onToggleAutopilot}
              className={`px-2.5 py-2 rounded-lg border font-mono-tech text-[11px] flex items-center gap-1.5 transition-all ${
                isAutopilot
                  ? 'bg-[#c59b63] text-[#0b0806] font-bold border-[#f3deb9] shadow-[0_0_15px_rgba(197,155,99,0.5)]'
                  : 'bg-[#17100b]/80 border-[#c59b63]/30 text-[#d6c7ba] hover:border-[#c59b63]'
              }`}
              title={isAutopilot ? 'Pause Autopilot Tour' : 'Start Autopilot Cinematic Drone'}
            >
              {isAutopilot ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span className="hidden md:inline">{isAutopilot ? 'TOUR ON' : 'TOUR'}</span>
            </button>

            {/* Terminal Button */}
            <button
              onClick={onOpenTerminal}
              className="p-2 sm:px-2.5 sm:py-2 rounded-lg bg-[#17100b]/80 border border-[#c59b63]/30 hover:border-[#c59b63] text-[#d6c7ba] font-mono-tech text-[11px] flex items-center gap-1.5 transition-colors"
              title="Open System CLI & Skills Matrix"
            >
              <Terminal className="w-3.5 h-3.5 text-[#c59b63]" />
              <span className="hidden md:inline">TERMINAL</span>
            </button>

            {/* Server Radar Button */}
            <button
              onClick={onOpenRadar}
              className="p-2 sm:px-2.5 sm:py-2 rounded-lg bg-[#17100b]/80 border border-[#c59b63]/30 hover:border-[#c59b63] text-[#d6c7ba] font-mono-tech text-[11px] flex items-center gap-1.5 transition-colors"
              title="Inspect Minecraft ZentraMC Server Radar"
            >
              <Radio className="w-3.5 h-3.5 text-green-400" />
              <span className="hidden md:inline">RADAR</span>
            </button>

            {/* Showreel Button */}
            <button
              onClick={onOpenShowreel}
              className="p-2 sm:px-2.5 sm:py-2 rounded-lg bg-[#17100b]/80 border border-[#c59b63]/30 hover:border-[#c59b63] text-[#d6c7ba] font-mono-tech text-[11px] flex items-center gap-1.5 transition-colors"
              title="Watch VFX & Editing Reel"
            >
              <Film className="w-3.5 h-3.5 text-[#c59b63]" />
              <span className="hidden md:inline">REEL</span>
            </button>

            {/* FX Controls Button */}
            <button
              onClick={onOpenFX}
              className="p-2 sm:p-2.5 rounded-lg bg-[#17100b]/80 border border-[#c59b63]/30 hover:border-[#c59b63] text-[#d6c7ba] transition-colors"
              title="Shader & Visual Environment FX"
            >
              <Sliders className="w-4 h-4 text-[#c59b63]" />
            </button>

            {/* Soundtrack & Audio Toggle */}
            <button
              onClick={onToggleAudio}
              className={`p-2 sm:px-2.5 sm:py-2 rounded-lg border font-mono-tech text-[11px] flex items-center gap-2 transition-all ${
                audioActive
                  ? 'bg-[#c59b63]/25 border-[#c59b63] text-[#f5ede6] shadow-[0_0_15px_rgba(197,155,99,0.35)]'
                  : 'bg-[#17100b]/80 border-[#c59b63]/30 text-[#9c8b7f] hover:text-[#d6c7ba] hover:border-[#c59b63]/60'
              }`}
              title={audioActive ? 'Pause Attention - Charlie Puth (MP3)' : 'Play Attention - Charlie Puth (MP3)'}
            >
              {audioActive ? (
                <>
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-2.5 bg-[#e6c594] animate-pulse" />
                    <span className="w-0.5 h-3.5 bg-[#c59b63] animate-bounce" />
                    <span className="w-0.5 h-1.5 bg-[#e6c594] animate-pulse" />
                  </div>
                  <Volume2 className="w-3.5 h-3.5 text-[#c59b63]" />
                  <span className="hidden xl:inline text-[10px] tracking-wider text-[#e6c594] font-medium">
                    ATTENTION
                  </span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline text-[10px] tracking-wider text-[#9c8b7f]">
                    MUTED
                  </span>
                </>
              )}
            </button>

            {/* Contact Button */}
            <button
              onClick={onOpenContactModal}
              className="bg-gradient-to-r from-[#c59b63] to-[#8c6239] text-[#0b0806] font-mono-tech font-bold text-xs tracking-wider px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-lg border border-[#e6c594] hover:shadow-[0_0_20px_rgba(197,155,99,0.4)] transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span>CONTACT</span>
              <span className="text-sm">↗</span>
            </button>
          </div>
        </div>

        {/* Autopilot Active Notification Ribbon */}
        {isAutopilot && (
          <div className="pointer-events-auto self-center bg-[#17100b]/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#c59b63] flex items-center gap-2 shadow-[0_0_20px_rgba(197,155,99,0.4)] animate-pulse">
            <Compass className="w-3.5 h-3.5 text-[#e6c594] animate-spin" />
            <span className="font-mono-tech text-[10px] text-[#f3deb9] tracking-wider">
              AUTOPILOT TOUR ACTIVE // GLIDING THROUGH 3D REEL [SCROLL OR CLICK TO PAUSE]
            </span>
          </div>
        )}
      </header>

      {/* Floating Side Info Badge (Desktop) */}
      <div className="hidden md:flex flex-col items-start gap-2 max-w-xs self-start my-auto">
        {activeProject ? (
          <div
            data-card="true"
            onClick={() => onOpenProjectModal(activeProject)}
            className="pointer-events-auto bg-[#17100b]/85 backdrop-blur-md p-4 rounded-xl border border-[#c59b63]/30 hover:border-[#c59b63]/80 shadow-2xl transition-all animate-fadeIn cursor-pointer"
          >
            <div className="flex items-center justify-between gap-3 mb-1">
              <span className="font-mono-tech text-[10px] tracking-widest text-[#c59b63]">
                NODE {activeProject.sectionNumber} // {activeProject.category.toUpperCase()}
              </span>
              <span className="font-mono-tech text-[9px] bg-[#2a1d15] text-[#e6c594] px-1.5 py-0.5 rounded border border-[#c59b63]/30">
                {activeProject.tag}
              </span>
            </div>
            <h4 className="font-display text-lg font-bold text-white mb-1">
              {activeProject.title}
            </h4>
            <p className="text-xs text-[#c4b5a8] line-clamp-2 mb-3">
              {activeProject.description}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenProjectModal(activeProject);
                }}
                className="flex-1 bg-[#2a1d15] hover:bg-[#3d2719] text-[#f5ede6] border border-[#c59b63]/40 hover:border-[#c59b63] font-mono-tech text-[11px] py-1.5 px-2.5 rounded flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-[#c59b63]" />
                <span>INSPECT NODE</span>
              </button>

              {activeProject.id === 'zentramc' && (
                <button
                  data-sound="copy"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyServerIp();
                  }}
                  className="bg-[#2a1d15] hover:bg-[#3d2719] text-[#e6c594] border border-[#c59b63]/40 font-mono-tech text-[11px] py-1.5 px-2.5 rounded flex items-center gap-1 transition-colors"
                  title="Copy Server IP: zentramc.loca.lol"
                >
                  {copiedIp ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-[#c59b63]" />}
                  <span>{copiedIp ? 'COPIED!' : 'IP'}</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div data-card="true" className="pointer-events-auto bg-[#17100b]/85 backdrop-blur-md p-3.5 rounded-xl border border-[#c59b63]/30 shadow-xl text-left">
            <span className="font-mono-tech text-[10px] tracking-widest text-[#c59b63] block mb-1">
              SYSTEM // CORE MATRIX
            </span>
            <p className="font-display text-sm font-semibold text-[#f5ede6]">
              AEVRNN Central Orb
            </p>
            <p className="font-mono-tech text-[10px] text-[#9c8b7f] mt-1">
              Scroll or use arrows to navigate through the 3D space.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Telemetry HUD */}
      <footer className="flex flex-col gap-2">
        {/* Progress Bar & Node markers */}
        <div className="pointer-events-auto w-full bg-[#17100b]/80 backdrop-blur-md p-2 md:px-4 md:py-2.5 rounded-xl border border-[#c59b63]/30 flex items-center gap-4 shadow-xl">
          {/* Node Step Back / Forward buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleStep(-1)}
              className="p-1.5 rounded bg-[#241810] hover:bg-[#38271c] text-[#c59b63] border border-[#c59b63]/30 transition-colors"
              title="Previous 3D Node (or Up Arrow)"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleStep(1)}
              className="p-1.5 rounded bg-[#241810] hover:bg-[#38271c] text-[#c59b63] border border-[#c59b63]/30 transition-colors"
              title="Next 3D Node (or Down Arrow)"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Continuous Track Bar */}
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[10px] font-mono-tech text-[#a8998d]">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3 h-3 text-[#c59b63] animate-spin" style={{ animationDuration: '12s' }} />
                <span>TRAJECTORY: {progressPercent}%</span>
              </span>
              <span className="hidden sm:inline text-[#c59b63]">
                {activeProject ? `FOCUS: ${activeProject.title}` : 'AEVRNN 3D LOGO CORE'}
              </span>
              <span>NODE {Math.round(currentProgress)} / {totalNodes}</span>
            </div>

            <div className="relative w-full h-2 bg-[#0b0806] rounded-full overflow-hidden border border-[#c59b63]/25">
              <div
                className="h-full bg-gradient-to-r from-[#8c6239] via-[#c59b63] to-[#f3deb9] transition-all duration-75 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Quick Active Inspect Button */}
          {activeProject && (
            <button
              onClick={() => onOpenProjectModal(activeProject)}
              className="hidden sm:flex items-center gap-1.5 bg-[#c59b63]/20 hover:bg-[#c59b63]/30 text-[#f5ede6] border border-[#c59b63] px-3 py-1.5 rounded-lg text-xs font-mono-tech transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#c59b63]" />
              <span>DETAILS</span>
            </button>
          )}
        </div>

        {/* Mobile quick category bar */}
        <div className="pointer-events-auto flex lg:hidden items-center justify-between gap-1 overflow-x-auto py-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onJumpToCategory(cat.id)}
              className={`text-[10px] font-mono-tech px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
                currentCategory === cat.id
                  ? 'bg-[#c59b63] text-[#0b0806] font-bold'
                  : 'bg-[#17100b]/80 text-[#a8998d] border border-[#c59b63]/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
};
