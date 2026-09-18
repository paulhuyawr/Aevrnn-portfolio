import React, { useState, useEffect, useRef } from 'react';
import { X, Terminal as TerminalIcon, Send, Sparkles, Check, Copy, HardDrive, Cpu, Shield, Zap } from 'lucide-react';
import { ambientSynth } from '../utils/audioEngine';
import { PORTFOLIO_DATA } from '../data/portfolioData';

interface TechTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWarpToNode: (index: number) => void;
}

interface CommandHistoryItem {
  id: string;
  type: 'input' | 'output' | 'error' | 'system';
  content: string | React.ReactNode;
}

export const TechTerminalModal: React.FC<TechTerminalModalProps> = ({
  isOpen,
  onClose,
  onWarpToNode,
}) => {
  const [activeTab, setActiveTab] = useState<'cli' | 'matrix'>('cli');
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      id: 'init-1',
      type: 'system',
      content: 'AEVRNN OS v4.8.2 // KERNEL ONLINE [SYSTEM RUNTIME READY]',
    },
    {
      id: 'init-2',
      type: 'output',
      content: 'Type "help" to view available diagnostics commands, or switch to the MATRIX tab.',
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, activeTab]);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (cmdStr: string) => {
    const raw = cmdStr.trim();
    if (!raw) return;

    ambientSynth.playTerminalKey();

    const parts = raw.toLowerCase().split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);

    const newHistory: CommandHistoryItem[] = [
      ...history,
      { id: String(Date.now()), type: 'input', content: `$ ${raw}` },
    ];

    switch (cmd) {
      case 'help':
        newHistory.push({
          id: String(Date.now() + 1),
          type: 'output',
          content: (
            <div className="space-y-1 text-xs font-mono-tech">
              <p className="text-[#c59b63] font-bold">AVAILABLE SYSTEM COMMANDS:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-2 text-[#cfc2b6]">
                <div><span className="text-[#f3deb9] font-semibold">help</span> : Show this instruction list</div>
                <div><span className="text-[#f3deb9] font-semibold">stack / skills</span> : Display technical capabilities</div>
                <div><span className="text-[#f3deb9] font-semibold">ping</span> : Test ZentraMC live server response</div>
                <div><span className="text-[#f3deb9] font-semibold">projects</span> : List all interactive nodes</div>
                <div><span className="text-[#f3deb9] font-semibold">warp &lt;num&gt;</span> : Fly to node (e.g. warp 1)</div>
                <div><span className="text-[#f3deb9] font-semibold">contact</span> : Show direct contact channels</div>
                <div><span className="text-[#f3deb9] font-semibold">whoami</span> : Information about Auritra Paul</div>
                <div><span className="text-[#f3deb9] font-semibold">clear</span> : Reset the terminal window</div>
              </div>
            </div>
          ),
        });
        break;

      case 'stack':
      case 'skills':
        newHistory.push({
          id: String(Date.now() + 1),
          type: 'output',
          content: (
            <div className="space-y-2 text-xs font-mono-tech">
              <p className="text-[#c59b63] font-bold">ENGINEERING BENCHMARK MATRIX:</p>
              <div className="space-y-1.5 pl-2 text-[#d6c7ba]">
                <div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white font-semibold">Minecraft (Paper / Java / Optimization)</span>
                    <span className="text-[#c59b63]">95%</span>
                  </div>
                  <div className="w-full bg-[#241810] h-1.5 rounded overflow-hidden">
                    <div className="bg-[#c59b63] h-full w-[95%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white font-semibold">Discord Architecture & Custom Bots (Node/TS)</span>
                    <span className="text-[#c59b63]">90%</span>
                  </div>
                  <div className="w-full bg-[#241810] h-1.5 rounded overflow-hidden">
                    <div className="bg-[#c59b63] h-full w-[90%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white font-semibold">Motion VFX & Video Production (AE / Premiere)</span>
                    <span className="text-[#c59b63]">92%</span>
                  </div>
                  <div className="w-full bg-[#241810] h-1.5 rounded overflow-hidden">
                    <div className="bg-[#c59b63] h-full w-[92%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white font-semibold">Web Development & 3D WebGL (React / Three.js)</span>
                    <span className="text-[#c59b63]">88%</span>
                  </div>
                  <div className="w-full bg-[#241810] h-1.5 rounded overflow-hidden">
                    <div className="bg-[#c59b63] h-full w-[88%]" />
                  </div>
                </div>
              </div>
            </div>
          ),
        });
        break;

      case 'ping':
        ambientSynth.playRadarPing();
        newHistory.push({
          id: String(Date.now() + 1),
          type: 'output',
          content: (
            <div className="space-y-1 text-xs font-mono-tech text-[#a8998d]">
              <p className="text-green-400 font-bold">PINGING zentramc.loca.lol ...</p>
              <p>64 bytes from 104.21.32.1: icmp_seq=1 ttl=56 time=18.4 ms</p>
              <p>64 bytes from 104.21.32.1: icmp_seq=2 ttl=56 time=17.9 ms</p>
              <p className="text-white">--- zentramc.loca.lol ping statistics ---</p>
              <p>2 packets transmitted, 2 received, 0% packet loss, avg = 18.15ms</p>
              <p className="text-[#c59b63] font-bold">SERVER STATUS: ONLINE // PAPER 1.20.4 // TPS: 20.0</p>
            </div>
          ),
        });
        break;

      case 'projects':
        newHistory.push({
          id: String(Date.now() + 1),
          type: 'output',
          content: (
            <div className="space-y-1 text-xs font-mono-tech">
              <p className="text-[#c59b63] font-bold">INDEXED 3D CORRIDOR NODES:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pl-2 text-[#cfc2b6]">
                {PORTFOLIO_DATA.map((p, idx) => (
                  <div
                    key={p.id}
                    data-card="true"
                    onClick={() => {
                      onWarpToNode(idx + 1);
                      onClose();
                    }}
                    className="cursor-pointer hover:text-[#e6c594] transition-colors p-1 rounded hover:bg-[#241810]"
                  >
                    [{idx + 1}] {p.title} <span className="text-[#8c6239]">({p.category})</span>
                  </div>
                ))}
              </div>
            </div>
          ),
        });
        break;

      case 'warp':
        const targetIdx = parseInt(args[0], 10);
        if (!isNaN(targetIdx) && targetIdx >= 0 && targetIdx <= PORTFOLIO_DATA.length) {
          ambientSynth.playNodeWarp();
          newHistory.push({
            id: String(Date.now() + 1),
            type: 'output',
            content: `Warping camera to Node ${targetIdx} ... [ENGAGED]`,
          });
          onWarpToNode(targetIdx);
          setTimeout(() => onClose(), 600);
        } else {
          newHistory.push({
            id: String(Date.now() + 1),
            type: 'error',
            content: `Invalid node index. Please choose a number between 0 and ${PORTFOLIO_DATA.length}.`,
          });
        }
        break;

      case 'contact':
        newHistory.push({
          id: String(Date.now() + 1),
          type: 'output',
          content: (
            <div className="space-y-1 text-xs font-mono-tech text-[#cfc2b6]">
              <p className="text-[#c59b63] font-bold">DIRECT TRANSMISSION CHANNELS:</p>
              <p>Email: <a href="mailto:aevyrr@gmail.com" className="text-white underline">aevyrr@gmail.com</a></p>
              <p>Discord User ID: <span className="text-[#e6c594]">1123668181534384229</span></p>
              <p>Discord Server: <a href="https://discord.gg/Q8cvUzamsQ" target="_blank" rel="noreferrer" className="text-[#c59b63] underline">discord.gg/Q8cvUzamsQ</a></p>
              <p>YouTube: <a href="https://youtube.com/@aevrnnvfx" target="_blank" rel="noreferrer" className="text-[#c59b63] underline">@aevrnnvfx</a></p>
              <p>Instagram: <a href="https://instagram.com/stfupaul_" target="_blank" rel="noreferrer" className="text-[#c59b63] underline">@stfupaul_</a></p>
            </div>
          ),
        });
        break;

      case 'whoami':
        newHistory.push({
          id: String(Date.now() + 1),
          type: 'output',
          content: (
            <div className="space-y-1 text-xs font-mono-tech text-[#cfc2b6]">
              <p className="text-white font-bold">AURITRA PAUL // AEVRNN</p>
              <p>Creator, developer, and video editor specializing in Minecraft server engineering, Discord bot ecosystems, cinematic motion VFX, and 3D Web experiences.</p>
              <p className="text-[#c59b63]">"Curious by default. Learning, building, and improving through every project."</p>
            </div>
          ),
        });
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      default:
        newHistory.push({
          id: String(Date.now() + 1),
          type: 'error',
          content: `Command not recognized: "${raw}". Type "help" for valid commands.`,
        });
        break;
    }

    setHistory(newHistory);
    setInputVal('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Box */}
      <div
        className="relative z-10 w-full max-w-3xl h-[80vh] max-h-[640px] bg-[#120c08] border border-[#c59b63]/50 rounded-2xl flex flex-col shadow-2xl overflow-hidden bronze-glow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="bg-[#1a110a] px-5 py-3.5 border-b border-[#c59b63]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TerminalIcon className="w-4 h-4 text-[#c59b63]" />
            <span className="font-mono-tech font-bold text-xs tracking-wider text-white">
              AEVRNN // SYSTEM TERMINAL & SPECS MATRIX
            </span>
            <div className="hidden sm:flex items-center gap-1.5 ml-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-mono-tech text-[10px] text-green-400">ONLINE</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tab switchers */}
            <div className="flex items-center bg-[#0e0906] p-1 rounded-lg border border-[#c59b63]/25">
              <button
                onClick={() => setActiveTab('cli')}
                className={`px-3 py-1 font-mono-tech text-[11px] rounded transition-all ${
                  activeTab === 'cli'
                    ? 'bg-[#c59b63] text-[#0b0806] font-bold'
                    : 'text-[#a8998d] hover:text-white'
                }`}
              >
                CLI PROMPT
              </button>
              <button
                onClick={() => setActiveTab('matrix')}
                className={`px-3 py-1 font-mono-tech text-[11px] rounded transition-all ${
                  activeTab === 'matrix'
                    ? 'bg-[#c59b63] text-[#0b0806] font-bold'
                    : 'text-[#a8998d] hover:text-white'
                }`}
              >
                STACK MATRIX
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#241810] hover:bg-[#38271c] text-[#a8998d] hover:text-white border border-[#c59b63]/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {activeTab === 'cli' ? (
          <div className="flex-1 flex flex-col p-4 font-mono-tech text-xs overflow-hidden">
            {/* Scrollable history log */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-[#c59b63]/30">
              {history.map((item) => (
                <div key={item.id} className="leading-relaxed">
                  {item.type === 'system' && (
                    <p className="text-[#8c6239] font-bold">{item.content}</p>
                  )}
                  {item.type === 'input' && (
                    <p className="text-[#f5ede6] font-semibold">{item.content}</p>
                  )}
                  {item.type === 'output' && (
                    <div className="text-[#c4b5a8]">{item.content}</div>
                  )}
                  {item.type === 'error' && (
                    <p className="text-red-400 font-bold">{item.content}</p>
                  )}
                </div>
              ))}
              <div ref={scrollEndRef} />
            </div>

            {/* Terminal Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCommand(inputVal);
              }}
              className="mt-3 pt-3 border-t border-[#c59b63]/25 flex items-center gap-2"
            >
              <span className="text-[#c59b63] font-bold">$</span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Type command (e.g. 'help', 'stack', 'ping', 'warp 1')..."
                className="flex-1 bg-transparent text-[#f5ede6] outline-none font-mono-tech text-xs placeholder-[#5a4638]"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-[#c59b63]/20 hover:bg-[#c59b63]/30 text-[#e6c594] border border-[#c59b63]/40 rounded font-mono-tech text-[10px] transition-colors"
              >
                EXEC ↵
              </button>
            </form>
          </div>
        ) : (
          /* Stack Matrix Tab */
          <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-[#c59b63]/30 text-[#e8dfd8]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box 1: Minecraft Systems */}
              <div data-card="true" className="p-4 bg-[#18100b] rounded-xl border border-[#c59b63]/30 hover:border-[#c59b63]/70 transition-colors cursor-pointer space-y-3">
                <div className="flex items-center gap-2 text-[#c59b63]">
                  <HardDrive className="w-4 h-4" />
                  <h4 className="font-mono-tech font-bold text-xs">01 // MINECRAFT CORE</h4>
                </div>
                <p className="text-xs text-[#a8998d]">
                  High-performance game systems, server orchestration, and custom combat mechanics.
                </p>
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono-tech">
                  <span className="px-2 py-0.5 bg-[#241810] border border-[#c59b63]/25 rounded text-[#e6c594]">PaperMC 1.20+</span>
                  <span className="px-2 py-0.5 bg-[#241810] border border-[#c59b63]/25 rounded text-[#e6c594]">Java 21</span>
                  <span className="px-2 py-0.5 bg-[#241810] border border-[#c59b63]/25 rounded text-[#e6c594]">Packet NMS</span>
                  <span className="px-2 py-0.5 bg-[#241810] border border-[#c59b63]/25 rounded text-[#e6c594]">ZentraDuels PvP</span>
                  <span className="px-2 py-0.5 bg-[#241810] border border-[#c59b63]/25 rounded text-[#e6c594]">Tick Optimization</span>
                </div>
              </div>

              {/* Box 2: Discord Architecture */}
              <div data-card="true" className="p-4 bg-[#18100b] rounded-xl border border-[#c59b63]/30 hover:border-[#c59b63]/70 transition-colors cursor-pointer space-y-3">
                <div className="flex items-center gap-2 text-[#c59b63]">
                  <Cpu className="w-4 h-4" />
                  <h4 className="font-mono-tech font-bold text-xs">02 // DISCORD ECOSYSTEM</h4>
                </div>
                <p className="text-xs text-[#a8998d]">
                  Event-driven bot architecture, automated community infrastructure, and AI integration.
                </p>
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono-tech">
                  <span className="px-2 py-0.5 bg-[#241810] border border-[#c59b63]/25 rounded text-[#e6c594]">Discord.js v14</span>
                  <span className="px-2 py-0.5 bg-[#241810] border border-[#c59b63]/25 rounded text-[#e6c594]">Node.js</span>
                  <span className="px-2 py-0.5 bg-[#241810] border border-[#c59b63]/25 rounded text-[#e6c594]">Zeno AI Support</span>
                  <span className="px-2 py-0.5 bg-[#241810] border border-[#c59b63]/25 rounded text-[#e6c594]">REST Gateway</span>
                  <span className="px-2 py-0.5 bg-[#241810] border border-[#c59b63]/25 rounded text-[#e6c594]">Role Permission Audits</span>
                </div>
              </div>

              {/* Box 3: Motion & VFX */}
              <div data-card="true" className="p-4 bg-[#18100b] rounded-xl border border-[#c59b63]/30 hover:border-[#c59b63]/70 transition-colors cursor-pointer space-y-3">
                <div className="flex items-center gap-2 text-[#c59b63]">
                  <Zap className="w-4 h-4" />
                  <h4 className="font-mono-tech font-bold text-xs">03 // MOTION DESIGN & VFX</h4>
                </div>
                <p className="text-xs text-[#a8998d]">
                  Kinetic typography, fast rhythm editing, speed ramps, visual styling, and audio staging.
                </p>
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono-tech">
                  <span className="px-2 py-0.5 bg-[#241810] border border-[#c59b63]/25 rounded text-[#e6c594]">After Effects</span>
                  <span className="px-2 py-0.5 bg-[#241810] border border-[#c59b63]/25 rounded text-[#e6c594]">Premiere Pro</span>
                  <span className="px-2 py-0.5 bg-[#241810] border border-[#c59b63]/25 rounded text-[#e6c594]">Sound Design</span>
                  <span className="px-2 py-0.5 bg-[#241810] border border-[#c59b63]/25 rounded text-[#e6c594]">Motion Tracking</span>
                  <span className="px-2 py-0.5 bg-[#241810] border border-[#c59b63]/25 rounded text-[#e6c594]">4K 60FPS</span>
                </div>
              </div>

              {/* Box 4: WebGL & Modern Frontend */}
              <div data-card="true" className="p-4 bg-[#18100b] rounded-xl border border-[#c59b63]/30 hover:border-[#c59b63]/70 transition-colors cursor-pointer space-y-3">
                <div className="flex items-center gap-2 text-[#c59b63]">
                  <Shield className="w-4 h-4" />
                  <h4 className="font-mono-tech font-bold text-xs">04 // WEBGL & FRONTEND</h4>
                </div>
                <p className="text-xs text-[#a8998d]">
                  Futuristic 3D interfaces, math lerp physics, procedural canvases, and responsive experiences.
                </p>
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono-tech">
                  <span className="px-2 py-0.5 bg-[#241810] border border-[#c59b63]/25 rounded text-[#e6c594]">Three.js</span>
                  <span className="px-2 py-0.5 bg-[#241810] border border-[#c59b63]/25 rounded text-[#e6c594]">WebGL</span>
                  <span className="px-2 py-0.5 bg-[#241810] border border-[#c59b63]/25 rounded text-[#e6c594]">TypeScript</span>
                  <span className="px-2 py-0.5 bg-[#241810] border border-[#c59b63]/25 rounded text-[#e6c594]">React 18</span>
                  <span className="px-2 py-0.5 bg-[#241810] border border-[#c59b63]/25 rounded text-[#e6c594]">Tailwind CSS</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
