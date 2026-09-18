import React from 'react';
import { X, Sliders, Eye, Sun, Box, Film, Compass, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { ambientSynth } from '../utils/audioEngine';

interface FXControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'bronze' | 'cyan' | 'monochrome';
  onChangeTheme: (theme: 'bronze' | 'cyan' | 'monochrome') => void;
  isWireframe: boolean;
  onToggleWireframe: () => void;
  isAutopilot: boolean;
  onToggleAutopilot: () => void;
  hasScanlines: boolean;
  onToggleScanlines: () => void;
  audioActive: boolean;
  onToggleAudio: () => void;
}

export const FXControlsModal: React.FC<FXControlsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onChangeTheme,
  isWireframe,
  onToggleWireframe,
  isAutopilot,
  onToggleAutopilot,
  hasScanlines,
  onToggleScanlines,
  audioActive,
  onToggleAudio,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div
        className="relative z-10 w-full max-w-md bg-[#140e0a] border border-[#c59b63]/50 rounded-2xl p-6 sm:p-7 shadow-2xl text-[#e8dfd8] overflow-hidden bronze-glow"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8c6239] via-[#c59b63] to-[#f3deb9]" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-[#241810] hover:bg-[#38271c] text-[#a8998d] hover:text-white border border-[#c59b63]/30 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-2 text-[#c59b63]">
          <Sliders className="w-5 h-5" />
          <h3 className="text-xl font-display font-bold text-white">
            Visual & Simulation FX
          </h3>
        </div>
        <p className="text-xs text-[#a8998d] mb-6">
          Tailor the 3D rendering pipeline, shader lighting, and automated flight parameters.
        </p>

        <div className="space-y-4">
          {/* 1. Theme Color Palette */}
          <div>
            <label className="block text-[10px] font-mono-tech tracking-wider text-[#c59b63] uppercase mb-2">
              ENVIRONMENT LIGHTING & ATMOSPHERE
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  ambientSynth.playHoverTick();
                  onChangeTheme('bronze');
                }}
                className={`py-2 px-2.5 rounded-lg border font-mono-tech text-xs flex flex-col items-center gap-1 transition-all ${
                  theme === 'bronze'
                    ? 'bg-[#c59b63] text-[#0b0806] font-bold border-[#f3deb9] shadow-[0_0_12px_rgba(197,155,99,0.5)]'
                    : 'bg-[#1e140d] text-[#cfc2b6] border-[#c59b63]/25 hover:border-[#c59b63]/60'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-[#c59b63] border border-white/40" />
                <span>BRONZE</span>
              </button>

              <button
                onClick={() => {
                  ambientSynth.playHoverTick();
                  onChangeTheme('cyan');
                }}
                className={`py-2 px-2.5 rounded-lg border font-mono-tech text-xs flex flex-col items-center gap-1 transition-all ${
                  theme === 'cyan'
                    ? 'bg-[#00f0ff] text-[#050f12] font-bold border-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.5)]'
                    : 'bg-[#1e140d] text-[#cfc2b6] border-[#c59b63]/25 hover:border-[#c59b63]/60'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-[#00f0ff] border border-white/40" />
                <span>CYBER</span>
              </button>

              <button
                onClick={() => {
                  ambientSynth.playHoverTick();
                  onChangeTheme('monochrome');
                }}
                className={`py-2 px-2.5 rounded-lg border font-mono-tech text-xs flex flex-col items-center gap-1 transition-all ${
                  theme === 'monochrome'
                    ? 'bg-white text-[#0a0a0a] font-bold border-gray-300 shadow-[0_0_12px_rgba(255,255,255,0.5)]'
                    : 'bg-[#1e140d] text-[#cfc2b6] border-[#c59b63]/25 hover:border-[#c59b63]/60'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-white border border-gray-400" />
                <span>OBSIDIAN</span>
              </button>
            </div>
          </div>

          {/* 2. Autopilot Drone Tour */}
          <div
            data-card="true"
            onClick={onToggleAutopilot}
            className="flex items-center justify-between p-3 rounded-xl bg-[#18100b] border border-[#c59b63]/30 hover:border-[#c59b63]/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Compass className={`w-4 h-4 ${isAutopilot ? 'text-[#e6c594] animate-spin' : 'text-[#8c6239]'}`} />
              <div>
                <span className="font-mono-tech text-xs font-bold text-white block">
                  Autopilot Drone Tour
                </span>
                <span className="text-[10px] text-[#a8998d]">
                  Automatically glide through all 3D portfolio stations
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleAutopilot();
              }}
              className={`px-3 py-1 font-mono-tech text-xs rounded-full border transition-all ${
                isAutopilot
                  ? 'bg-[#c59b63] text-[#0b0806] font-bold border-[#f3deb9]'
                  : 'bg-[#241810] text-[#a8998d] border-[#c59b63]/30'
              }`}
            >
              {isAutopilot ? 'ACTIVE' : 'OFF'}
            </button>
          </div>

          {/* 3. Wireframe 3D Blueprint Mode */}
          <div
            data-card="true"
            onClick={onToggleWireframe}
            className="flex items-center justify-between p-3 rounded-xl bg-[#18100b] border border-[#c59b63]/30 hover:border-[#c59b63]/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Box className="w-4 h-4 text-[#c59b63]" />
              <div>
                <span className="font-mono-tech text-xs font-bold text-white block">
                  Wireframe Blueprint
                </span>
                <span className="text-[10px] text-[#a8998d]">
                  Render 3D screen geometries as wireframe vectors
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWireframe();
              }}
              className={`px-3 py-1 font-mono-tech text-xs rounded-full border transition-all ${
                isWireframe
                  ? 'bg-[#c59b63] text-[#0b0806] font-bold border-[#f3deb9]'
                  : 'bg-[#241810] text-[#a8998d] border-[#c59b63]/30'
              }`}
            >
              {isWireframe ? 'ENABLED' : 'OFF'}
            </button>
          </div>

          {/* 4. Film Grain & Scanlines */}
          <div
            data-card="true"
            onClick={onToggleScanlines}
            className="flex items-center justify-between p-3 rounded-xl bg-[#18100b] border border-[#c59b63]/30 hover:border-[#c59b63]/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Film className="w-4 h-4 text-[#c59b63]" />
              <div>
                <span className="font-mono-tech text-xs font-bold text-white block">
                  CRT Film Grain & Texture
                </span>
                <span className="text-[10px] text-[#a8998d]">
                  Cinematic analog scanline overlay
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleScanlines();
              }}
              className={`px-3 py-1 font-mono-tech text-xs rounded-full border transition-all ${
                hasScanlines
                  ? 'bg-[#c59b63] text-[#0b0806] font-bold border-[#f3deb9]'
                  : 'bg-[#241810] text-[#a8998d] border-[#c59b63]/30'
              }`}
            >
              {hasScanlines ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* 5. Spatial Audio */}
          <div
            data-card="true"
            onClick={onToggleAudio}
            className="flex items-center justify-between p-3 rounded-xl bg-[#18100b] border border-[#c59b63]/30 hover:border-[#c59b63]/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              {audioActive ? <Volume2 className="w-4 h-4 text-[#c59b63]" /> : <VolumeX className="w-4 h-4 text-[#8c6239]" />}
              <div>
                <span className="font-mono-tech text-xs font-bold text-white block">
                  Soundtrack & Spatial SFX
                </span>
                <span className="text-[10px] text-[#a8998d]">
                  Charlie Puth - Attention (MP3) & UI acoustic feedback
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleAudio();
              }}
              className={`px-3 py-1 font-mono-tech text-xs rounded-full border transition-all ${
                audioActive
                  ? 'bg-[#c59b63] text-[#0b0806] font-bold border-[#f3deb9]'
                  : 'bg-[#241810] text-[#a8998d] border-[#c59b63]/30'
              }`}
            >
              {audioActive ? 'ON' : 'MUTED'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
