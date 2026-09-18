import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Youtube, ExternalLink, Sparkles, Volume2, Film, Maximize2 } from 'lucide-react';
import { ambientSynth } from '../utils/audioEngine';

interface ShowreelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShowreelModal: React.FC<ShowreelModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(35);

  useEffect(() => {
    let timer: any;
    if (isOpen && isPlaying) {
      timer = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.4));
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  const togglePlay = () => {
    ambientSynth.playHoverTick();
    setIsPlaying(!isPlaying);
  };

  const secondsTotal = 84; // 1m 24s
  const currentSec = Math.floor((progress / 100) * secondsTotal);
  const m = Math.floor(currentSec / 60);
  const s = currentSec % 60;
  const timecode = `00:0${m}:${s < 10 ? '0' : ''}${s}:18`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div
        className="relative z-10 w-full max-w-2xl bg-[#120c08] border border-[#c59b63]/50 rounded-2xl p-6 sm:p-8 shadow-2xl text-[#e8dfd8] overflow-hidden bronze-glow"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8c6239] via-[#c59b63] to-[#f3deb9]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-[#241810] hover:bg-[#38271c] text-[#a8998d] hover:text-white border border-[#c59b63]/30 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs font-mono-tech text-[#c59b63] mb-1">
            <Film className="w-3.5 h-3.5" />
            <span>AEVRNN // MOTION VFX & EDITING SHOWREEL</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Cinematic Reel 2026
          </h3>
          <p className="text-xs text-[#a8998d] mt-1">
            Kinetic typography, After Effects visual staging, gaming montages, and speed-ramp editing.
          </p>
        </div>

        {/* Simulated Video Player Stage */}
        <div data-card="true" className="relative aspect-video w-full bg-[#0a0705] rounded-xl overflow-hidden border border-[#c59b63]/30 hover:border-[#c59b63]/60 transition-colors flex flex-col justify-between p-4 mb-4 shadow-2xl group cursor-pointer">
          {/* Animated Background Reel Simulation */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,155,99,0.15)_0%,rgba(11,8,6,0.95)_75%)]" />

          {/* Video Grid & Scanlines */}
          <div className="absolute inset-0 film-grain opacity-50 pointer-events-none" />

          {/* Central Play/Pause Watermark */}
          <div
            onClick={togglePlay}
            className="relative z-10 my-auto self-center flex flex-col items-center cursor-pointer group-hover:scale-105 transition-transform"
          >
            <div className="w-16 h-16 rounded-full bg-[#1e140d]/90 border border-[#c59b63] flex items-center justify-center text-[#f3deb9] shadow-[0_0_25px_rgba(197,155,99,0.4)]">
              {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 fill-current ml-1" />}
            </div>
            <span className="font-mono-tech text-[10px] text-[#c59b63] tracking-widest mt-2">
              {isPlaying ? 'PREVIEWING SHOWREEL TIMELINE' : 'TIMELINE PAUSED'}
            </span>
          </div>

          {/* Audio Waveform Simulation Bar */}
          <div className="relative z-10 flex items-center justify-center gap-1 my-2">
            {[40, 65, 85, 30, 95, 70, 50, 80, 45, 90, 60, 75, 35, 88, 55, 68, 82, 44].map((h, i) => (
              <div
                key={i}
                className="w-1 bg-[#c59b63]/60 rounded-full transition-all duration-150"
                style={{
                  height: isPlaying ? `${Math.max(6, (h * ((i + 3) % 4 + 1)) % 32)}px` : '4px',
                }}
              />
            ))}
          </div>

          {/* Bottom Timeline Controls */}
          <div className="relative z-10 flex flex-col gap-2 pt-2 border-t border-[#c59b63]/20">
            {/* Scrubber track */}
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = ((e.clientX - rect.left) / rect.width) * 100;
                setProgress(Math.max(0, Math.min(100, pct)));
              }}
              className="relative w-full h-1.5 bg-[#241810] rounded-full cursor-pointer overflow-hidden border border-[#c59b63]/30"
            >
              <div
                className="h-full bg-gradient-to-r from-[#8c6239] via-[#c59b63] to-[#f3deb9]"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between font-mono-tech text-[10px] text-[#a8998d]">
              <span className="text-white font-bold">{timecode}</span>
              <span className="text-[#c59b63]">PRORES 4444 XQ // 60.000 FPS</span>
              <span>TOTAL 00:01:24:18</span>
            </div>
          </div>
        </div>

        {/* Action Buttons to View on YouTube */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <a
              href="https://youtube.com/@aevrnnvfx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-[#c59b63] to-[#8c6239] text-[#0b0806] font-mono-tech font-bold text-xs px-4 py-2.5 rounded-lg border border-[#f3deb9] hover:shadow-[0_0_15px_rgba(197,155,99,0.4)] transition-all active:scale-95"
            >
              <Youtube className="w-4 h-4" />
              <span>WATCH ON YOUTUBE (@aevrnnvfx) ↗</span>
            </a>

            <a
              href="https://youtube.com/@aevrnnvfx/shorts"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#241810] hover:bg-[#38271c] text-[#f3deb9] border border-[#c59b63]/40 font-mono-tech text-xs px-3.5 py-2.5 rounded-lg transition-colors"
            >
              <span>SHORTS REEL</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#c59b63]" />
            </a>
          </div>

          <span className="text-[11px] font-mono-tech text-[#8c6239]">
            EDITED IN PREMIERE & AFTER EFFECTS
          </span>
        </div>
      </div>
    </div>
  );
};
