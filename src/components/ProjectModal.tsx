import React, { useEffect } from 'react';
import { ProjectItem } from '../data/portfolioData';
import { X, ExternalLink, Copy, Check, Terminal, Sparkles, Youtube, MessageSquare } from 'lucide-react';
import { ambientSynth } from '../utils/audioEngine';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onOpenContact: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onOpenContact }) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    ambientSynth.playCopySuccess();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Box */}
      <div
        className="relative z-10 w-full max-w-2xl bg-[#140e0a] border border-[#c59b63]/40 rounded-2xl p-6 sm:p-8 shadow-2xl text-[#e8dfd8] overflow-hidden bronze-glow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Bronze Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8c6239] via-[#c59b63] to-[#f3deb9]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-[#241810] hover:bg-[#38271c] text-[#a8998d] hover:text-[#f5ede6] border border-[#c59b63]/30 transition-colors"
          title="Close Inspector"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tech mb-3">
          <span className="text-[#c59b63] font-bold">
            {project.sectionNumber} // {project.sectionTitle}
          </span>
          <span className="text-[#5c402c]">•</span>
          <span className="bg-[#241810] text-[#e6c594] px-2.5 py-0.5 rounded border border-[#c59b63]/30">
            {project.tag}
          </span>
        </div>

        {/* Subtitle & Title */}
        <div className="mb-4">
          <span className="text-xs font-mono-tech text-[#a8998d] tracking-widest block uppercase">
            {project.subtitle}
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
            {project.title}
          </h2>
        </div>

        {/* Description */}
        <div className="space-y-3 mb-6 text-[#cfc2b6] text-sm sm:text-base leading-relaxed border-t border-[#c59b63]/20 pt-4">
          <p className="font-medium text-white">{project.description}</p>
          {project.detailedText && (
            <p className="text-[#a8998d] whitespace-pre-line text-xs sm:text-sm">
              {project.detailedText}
            </p>
          )}
        </div>

        {/* Stats Grid */}
        {project.stats && project.stats.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
            {project.stats.map((stat, idx) => (
              <div
                key={idx}
                data-card="true"
                className="bg-[#1c130d] p-3 rounded-lg border border-[#c59b63]/25 hover:border-[#c59b63]/60 flex flex-col justify-between cursor-pointer transition-colors"
              >
                <span className="font-mono-tech text-[10px] text-[#8c6239] uppercase tracking-wider">
                  {stat.label}
                </span>
                <span className="font-mono-tech text-xs sm:text-sm font-bold text-[#f5ede6] mt-1 break-words">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.tags.map((tag, idx) => (
            <span
              key={idx}
              className="font-mono-tech text-[11px] px-2.5 py-1 bg-[#1a110a] text-[#c59b63] border border-[#c59b63]/30 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#c59b63]/25">
          {project.links.map((link, idx) => {
            if (link.type === 'copy') {
              return (
                <button
                  key={idx}
                  data-sound="copy"
                  onClick={() => handleCopy(link.url)}
                  className="flex items-center gap-2 bg-[#2a1d15] hover:bg-[#3d2719] text-[#e6c594] border border-[#c59b63] font-mono-tech text-xs px-4 py-2.5 rounded-lg transition-all active:scale-95"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-[#c59b63]" />}
                  <span>{copied ? 'IP COPIED TO CLIPBOARD!' : link.label}</span>
                </button>
              );
            }

            if (link.type === 'action') {
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onClose();
                    onOpenContact();
                  }}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#c59b63] to-[#8c6239] text-[#0b0806] font-mono-tech font-bold text-xs px-4 py-2.5 rounded-lg border border-[#e6c594] transition-all hover:shadow-[0_0_15px_rgba(197,155,99,0.4)] active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{link.label}</span>
                </button>
              );
            }

            return (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-[#c59b63] to-[#8c6239] text-[#0b0806] font-mono-tech font-bold text-xs px-4 py-2.5 rounded-lg border border-[#e6c594] transition-all hover:shadow-[0_0_15px_rgba(197,155,99,0.4)] active:scale-95"
              >
                <span>{link.label}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            );
          })}

          <button
            onClick={onClose}
            className="ml-auto text-xs font-mono-tech text-[#a8998d] hover:text-white px-3 py-2 transition-colors"
          >
            RETURN TO 3D WORLD [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
