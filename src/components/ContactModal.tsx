import React, { useState } from 'react';
import { X, Send, Mail, MessageSquare, Instagram, Youtube, CheckCircle2, AlertCircle } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('https://formspree.io/f/xljezbyj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        const resData = await response.json();
        throw new Error(resData.error || 'Failed to dispatch message');
      }
    } catch (err: any) {
      console.warn('Formspree dispatch error:', err);
      // Even if network blocks formspree, we allow fallback direct mailto
      setStatus('error');
      setErrorMessage(err.message || 'Transmission failed. You can reach out directly via aevyrr@gmail.com.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Box */}
      <div
        className="relative z-10 w-full max-w-xl bg-[#140e0a] border border-[#c59b63]/40 rounded-2xl p-6 sm:p-8 shadow-2xl text-[#e8dfd8] overflow-hidden bronze-glow"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8c6239] via-[#c59b63] to-[#f3deb9]" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-[#241810] hover:bg-[#38271c] text-[#a8998d] hover:text-[#f5ede6] border border-[#c59b63]/30 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono-tech text-[#c59b63] mb-1">
            <span>AEVRNN // TERMINAL 07</span>
            <span>•</span>
            <span>CONTACT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Let&apos;s build <span className="text-bronze-gradient">something.</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#a8998d] mt-1">
            Tell me what you&apos;re working on and I&apos;ll get back to you.
          </p>
        </div>

        {/* Status Messages */}
        {status === 'success' && (
          <div className="mb-6 p-4 rounded-xl bg-[#1a2e1c] border border-green-500/40 text-green-300 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-400" />
            <div className="text-xs space-y-1">
              <p className="font-bold">Message Dispatched Successfully</p>
              <p className="text-green-300/80">
                Thank you! Your inquiry has been received. I will reply to your email address shortly.
              </p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="mb-6 p-4 rounded-xl bg-[#2e1a1a] border border-red-500/40 text-red-300 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
            <div className="text-xs space-y-1">
              <p className="font-bold">Transmission Notice</p>
              <p className="text-red-300/80">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-[10px] font-mono-tech tracking-wider text-[#c59b63] uppercase mb-1.5">
              YOUR NAME
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Auritra Paul"
              className="w-full bg-[#1c130d] border border-[#c59b63]/30 focus:border-[#c59b63] rounded-lg px-3.5 py-2.5 text-sm text-[#f5ede6] placeholder-[#6b584a] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono-tech tracking-wider text-[#c59b63] uppercase mb-1.5">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full bg-[#1c130d] border border-[#c59b63]/30 focus:border-[#c59b63] rounded-lg px-3.5 py-2.5 text-sm text-[#f5ede6] placeholder-[#6b584a] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono-tech tracking-wider text-[#c59b63] uppercase mb-1.5">
              MESSAGE
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell me about your Minecraft, Discord, editing, or web project..."
              className="w-full bg-[#1c130d] border border-[#c59b63]/30 focus:border-[#c59b63] rounded-lg px-3.5 py-2.5 text-sm text-[#f5ede6] placeholder-[#6b584a] outline-none transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full bg-gradient-to-r from-[#c59b63] via-[#d4af37] to-[#8c6239] text-[#0b0806] font-mono-tech font-bold text-xs tracking-wider py-3 rounded-lg border border-[#f3deb9] hover:shadow-[0_0_20px_rgba(197,155,99,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
          >
            <Send className="w-4 h-4" />
            <span>{status === 'sending' ? 'TRANSMITTING...' : 'SEND MESSAGE ↗'}</span>
          </button>
        </form>

        {/* Footer info & Direct links */}
        <div className="pt-4 border-t border-[#c59b63]/25 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#a8998d]">
            <Mail className="w-4 h-4 text-[#c59b63]" />
            <a
              href="mailto:aevyrr@gmail.com"
              className="font-mono-tech text-[#c59b63] hover:underline"
            >
              aevyrr@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://discord.com/users/1123668181534384229"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded bg-[#1c130d] hover:bg-[#2a1d15] text-[#c59b63] border border-[#c59b63]/30 transition-colors"
              title="Discord Profile"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com/@aevrnnvfx"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded bg-[#1c130d] hover:bg-[#2a1d15] text-[#c59b63] border border-[#c59b63]/30 transition-colors"
              title="YouTube @aevrnnvfx"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href="https://www.instagram.com/stfupaul_"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded bg-[#1c130d] hover:bg-[#2a1d15] text-[#c59b63] border border-[#c59b63]/30 transition-colors"
              title="Instagram @stfupaul_"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
