import React, { useState, useEffect } from 'react';
import { X, Server, Copy, Check, Radio, Activity, ShieldCheck, Users, RefreshCw } from 'lucide-react';
import { ambientSynth } from '../utils/audioEngine';

interface ServerRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ServerRadarModal: React.FC<ServerRadarModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pingData, setPingData] = useState({
    status: 'ONLINE',
    latency: 18,
    playersOnline: 14,
    maxPlayers: 100,
    tps: '20.00',
    version: 'Paper 1.20.4 (Java)',
    motd: '§6§lZENTRAMC NETWORK §8» §fDynamic PvP & High Concurrency\n§7Season 2026 // Connect Now with §e/duel',
  });

  const handleCopy = () => {
    navigator.clipboard.writeText('zentramc.loca.lol');
    ambientSynth.playCopySuccess();
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const refreshDiagnostics = () => {
    setIsRefreshing(true);
    ambientSynth.playRadarPing();
    setTimeout(() => {
      setPingData((prev) => ({
        ...prev,
        latency: 16 + Math.floor(Math.random() * 6),
        playersOnline: Math.max(10, prev.playersOnline + Math.floor(Math.random() * 5 - 2)),
      }));
      setIsRefreshing(false);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div
        className="relative z-10 w-full max-w-xl bg-[#140e0a] border border-[#c59b63]/50 rounded-2xl p-6 sm:p-8 shadow-2xl text-[#e8dfd8] overflow-hidden bronze-glow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Metallic Bronze Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8c6239] via-[#c59b63] to-[#f3deb9]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-[#241810] hover:bg-[#38271c] text-[#a8998d] hover:text-white border border-[#c59b63]/30 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-lg bg-[#241810] border border-[#c59b63]/40 text-[#c59b63]">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-tech text-[#c59b63]">
              <span>MINECRAFT INFRASTRUCTURE</span>
              <span>•</span>
              <span className="text-green-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                ACTIVE NODE
              </span>
            </div>
            <h3 className="text-2xl font-display font-bold text-white">
              ZentraMC Server Radar
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#cfc2b6] mb-6">
          Real-time network telemetry and connection portal for the ZentraMC high-concurrency Minecraft server network.
        </p>

        {/* Server IP Quick Copy Banner */}
        <div data-card="true" className="p-3.5 bg-[#1e140d] border border-[#c59b63]/40 rounded-xl mb-6 flex items-center justify-between gap-3 shadow-inner cursor-pointer hover:border-[#c59b63]/70 transition-colors">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono-tech text-[#8c6239] uppercase tracking-wider">
              SERVER IP ADDRESS
            </span>
            <span className="font-mono-tech text-base font-bold text-[#f3deb9] tracking-wider select-all">
              zentramc.loca.lol
            </span>
          </div>

          <button
            data-sound="copy"
            onClick={handleCopy}
            className="flex items-center gap-2 bg-gradient-to-r from-[#c59b63] to-[#8c6239] text-[#0b0806] font-mono-tech font-bold text-xs px-4 py-2.5 rounded-lg border border-[#f3deb9] hover:shadow-[0_0_15px_rgba(197,155,99,0.4)] transition-all active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-green-900" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'IP COPIED!' : 'COPY IP'}</span>
          </button>
        </div>

        {/* Diagnostic Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
          <div data-card="true" className="bg-[#18100b] p-3 rounded-lg border border-[#c59b63]/25 hover:border-[#c59b63]/60 cursor-pointer transition-colors flex flex-col">
            <span className="font-mono-tech text-[10px] text-[#8c6239] flex items-center gap-1">
              <Radio className="w-3 h-3 text-[#c59b63]" /> LATENCY
            </span>
            <span className="font-mono-tech text-sm font-bold text-green-400 mt-1">
              {pingData.latency} ms
            </span>
          </div>

          <div data-card="true" className="bg-[#18100b] p-3 rounded-lg border border-[#c59b63]/25 hover:border-[#c59b63]/60 cursor-pointer transition-colors flex flex-col">
            <span className="font-mono-tech text-[10px] text-[#8c6239] flex items-center gap-1">
              <Activity className="w-3 h-3 text-[#c59b63]" /> TICK RATE
            </span>
            <span className="font-mono-tech text-sm font-bold text-white mt-1">
              {pingData.tps} TPS
            </span>
          </div>

          <div data-card="true" className="bg-[#18100b] p-3 rounded-lg border border-[#c59b63]/25 hover:border-[#c59b63]/60 cursor-pointer transition-colors flex flex-col">
            <span className="font-mono-tech text-[10px] text-[#8c6239] flex items-center gap-1">
              <Users className="w-3 h-3 text-[#c59b63]" /> PLAYERS
            </span>
            <span className="font-mono-tech text-sm font-bold text-white mt-1">
              {pingData.playersOnline} / {pingData.maxPlayers}
            </span>
          </div>

          <div data-card="true" className="bg-[#18100b] p-3 rounded-lg border border-[#c59b63]/25 hover:border-[#c59b63]/60 cursor-pointer transition-colors flex flex-col">
            <span className="font-mono-tech text-[10px] text-[#8c6239] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#c59b63]" /> RUNTIME
            </span>
            <span className="font-mono-tech text-xs font-bold text-[#e6c594] mt-1 truncate" title="Paper 1.20.4">
              Paper 1.20.4
            </span>
          </div>
        </div>

        {/* MOTD Preview Terminal */}
        <div data-card="true" className="p-3.5 bg-[#0b0806] rounded-xl border border-[#c59b63]/30 font-mono-tech text-xs text-[#cfc2b6] mb-6">
          <div className="flex items-center justify-between text-[10px] text-[#8c6239] border-b border-[#c59b63]/20 pb-1.5 mb-2">
            <span>LIVE SERVER MOTD</span>
            <button
              data-sound="ping"
              onClick={refreshDiagnostics}
              disabled={isRefreshing}
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-[#c59b63]' : ''}`} />
              <span>REFRESH</span>
            </button>
          </div>
          <div className="space-y-0.5 leading-relaxed">
            <p className="text-[#f3deb9] font-bold">ZENTRAMC NETWORK » Dynamic PvP & High Concurrency</p>
            <p className="text-[#a8998d]">Season 2026 // Connect Now with /duel</p>
          </div>
        </div>

        {/* How to Connect Instructions */}
        <div className="text-xs text-[#a8998d] space-y-1 pt-2 border-t border-[#c59b63]/20">
          <p className="font-bold text-white font-mono-tech text-[11px]">HOW TO JOIN:</p>
          <p>1. Open Minecraft Java Edition (Version 1.20.x or modern release).</p>
          <p>2. Select <strong className="text-white">Multiplayer</strong> → <strong className="text-white">Direct Connection</strong> (or Add Server).</p>
          <p>3. Paste <strong className="text-[#e6c594]">zentramc.loca.lol</strong> and hit Join Server.</p>
        </div>
      </div>
    </div>
  );
};
