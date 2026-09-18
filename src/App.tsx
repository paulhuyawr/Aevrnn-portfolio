import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PortfolioScene } from './three/PortfolioScene';
import { PORTFOLIO_DATA, ProjectItem } from './data/portfolioData';
import { NavigationHUD } from './components/NavigationHUD';
import { ProjectModal } from './components/ProjectModal';
import { ContactModal } from './components/ContactModal';
import { CinematicIntro } from './components/CinematicIntro';
import { HUDReticle } from './components/HUDReticle';
import { TechTerminalModal } from './components/TechTerminalModal';
import { ServerRadarModal } from './components/ServerRadarModal';
import { ShowreelModal } from './components/ShowreelModal';
import { FXControlsModal } from './components/FXControlsModal';
import { ambientSynth } from './utils/audioEngine';

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<PortfolioScene | null>(null);

  const [currentProgress, setCurrentProgress] = useState(0);
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isIntroVisible, setIsIntroVisible] = useState(true);
  const [audioActive, setAudioActive] = useState(false);

  // New Features State
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isRadarOpen, setIsRadarOpen] = useState(false);
  const [isShowreelOpen, setIsShowreelOpen] = useState(false);
  const [isFXOpen, setIsFXOpen] = useState(false);
  const [isAutopilot, setIsAutopilot] = useState(false);
  const [isWireframe, setIsWireframe] = useState(false);
  const [theme, setTheme] = useState<'bronze' | 'cyan' | 'monochrome'>('bronze');
  const [hasScanlines, setHasScanlines] = useState(true);

  // Sync audio state with ambientSynth
  useEffect(() => {
    const unsubscribe = ambientSynth.subscribe((playing) => {
      setAudioActive(playing);
    });
    return () => unsubscribe();
  }, []);

  // Whenever we enter the website: Play Charlie Puth - Attention MP3!
  useEffect(() => {
    let hasAttemptedInteractionPlay = false;

    // 1. Attempt immediate playback on website load
    ambientSynth.play().then((started) => {
      if (started) {
        setAudioActive(true);
      }
    });

    // 2. Browser Autoplay Policy Resilience:
    // If un-interacted autoplay was deferred by the browser,
    // trigger playback seamlessly on the very first gesture (click, touch, scroll, key).
    const handleFirstUserGesture = () => {
      if (!hasAttemptedInteractionPlay) {
        hasAttemptedInteractionPlay = true;
        ambientSynth.play().then((started) => {
          if (started) setAudioActive(true);
        });
      }
      cleanupListeners();
    };

    const cleanupListeners = () => {
      window.removeEventListener('click', handleFirstUserGesture, true);
      window.removeEventListener('touchstart', handleFirstUserGesture, true);
      window.removeEventListener('keydown', handleFirstUserGesture, true);
      window.removeEventListener('wheel', handleFirstUserGesture, true);
    };

    window.addEventListener('click', handleFirstUserGesture, true);
    window.addEventListener('touchstart', handleFirstUserGesture, true);
    window.addEventListener('keydown', handleFirstUserGesture, true);
    window.addEventListener('wheel', handleFirstUserGesture, true);

    return () => {
      cleanupListeners();
    };
  }, []);

  // Global Sound Effects: Play audio feedback whenever user clicks any card or button
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Check if clicked element or its parent is a button or actionable element
      const buttonEl = target.closest<HTMLElement>(
        'button, [role="button"], input[type="button"], input[type="submit"], a[href], a.btn'
      );

      // 2. Check if clicked element or its parent is a card
      const cardEl = target.closest<HTMLElement>(
        '[data-card], [data-card-item], .interactive-card, [class*="card"]'
      );

      // If button was clicked:
      if (buttonEl) {
        // If button has specific sound like copy success, let that sound take lead
        const customSound = buttonEl.getAttribute('data-sound');
        if (customSound === 'copy' || customSound === 'ping') {
          return;
        }
        ambientSynth.playButtonClick();
        return;
      }

      // If card was clicked (and not a button inside it):
      if (cardEl) {
        ambientSynth.playCardClick();
        return;
      }
    };

    // Use capturing phase so it triggers reliably even if stopPropagation is used
    window.addEventListener('click', handleGlobalClick, true);
    return () => window.removeEventListener('click', handleGlobalClick, true);
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new PortfolioScene(mountRef.current, {
      onCardSelect: (project) => {
        setSelectedProject(project);
      },
      onActiveSectionChange: (index, project) => {
        setActiveProject(project);
        if (index > 0) {
          setIsIntroVisible(false);
        }
      },
      onProgressUpdate: (progress) => {
        setCurrentProgress(progress);
      },
    });

    sceneRef.current = scene;

    return () => {
      scene.destroy();
      sceneRef.current = null;
    };
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If any modal is open
      if (
        selectedProject ||
        isContactOpen ||
        isTerminalOpen ||
        isRadarOpen ||
        isShowreelOpen ||
        isFXOpen
      ) {
        if (e.key === 'Escape') {
          setSelectedProject(null);
          setIsContactOpen(false);
          setIsTerminalOpen(false);
          setIsRadarOpen(false);
          setIsShowreelOpen(false);
          setIsFXOpen(false);
        }
        return;
      }

      // Interrupt autopilot on manual user input
      if (isAutopilot) {
        setIsAutopilot(false);
        sceneRef.current?.setAutopilot(false);
      }

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        sceneRef.current?.addScrollDelta(350);
        setIsIntroVisible(false);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        sceneRef.current?.addScrollDelta(-350);
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (activeProject) {
          setSelectedProject(activeProject);
        }
      } else if (e.key === 't' || e.key === 'T') {
        setIsTerminalOpen(true);
      } else if (e.key === 'r' || e.key === 'R') {
        setIsRadarOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedProject,
    isContactOpen,
    isTerminalOpen,
    isRadarOpen,
    isShowreelOpen,
    isFXOpen,
    activeProject,
    isAutopilot,
  ]);

  // Jump handlers
  const handleJumpToCategory = useCallback((category: string) => {
    setIsIntroVisible(false);
    if (isAutopilot) {
      setIsAutopilot(false);
      sceneRef.current?.setAutopilot(false);
    }
    sceneRef.current?.jumpToSection(category);
  }, [isAutopilot]);

  const handleScrollStep = useCallback((direction: number) => {
    setIsIntroVisible(false);
    if (isAutopilot) {
      setIsAutopilot(false);
      sceneRef.current?.setAutopilot(false);
    }
    sceneRef.current?.addScrollDelta(direction * 400);
  }, [isAutopilot]);

  const handleEnterIntro = useCallback(() => {
    setIsIntroVisible(false);
    // Smoothly fly camera forward through the 3D AEVRNN logo into ZentraMC
    sceneRef.current?.setTargetProgress(1);
    ambientSynth.play();
    setAudioActive(true);
  }, []);

  const handleToggleAudio = useCallback(() => {
    const newState = ambientSynth.toggle();
    setAudioActive(newState);
  }, []);

  const handleToggleAutopilot = useCallback(() => {
    setIsAutopilot((prev) => {
      const next = !prev;
      sceneRef.current?.setAutopilot(next);
      if (next) {
        setIsIntroVisible(false);
      }
      return next;
    });
  }, []);

  const handleToggleWireframe = useCallback(() => {
    setIsWireframe((prev) => {
      const next = !prev;
      sceneRef.current?.setWireframe(next);
      return next;
    });
  }, []);

  const handleChangeTheme = useCallback((newTheme: 'bronze' | 'cyan' | 'monochrome') => {
    setTheme(newTheme);
    sceneRef.current?.setTheme(newTheme);
  }, []);

  const handleWarpToNode = useCallback((nodeIndex: number) => {
    setIsIntroVisible(false);
    sceneRef.current?.jumpToIndex(nodeIndex);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0b0806] select-none">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Sci-Fi HUD Crosshair Reticle */}
      <HUDReticle activeProject={activeProject} currentProgress={currentProgress} />

      {/* Cinematic CRT Scanline / Film Grain subtle overlay */}
      {hasScanlines && (
        <div className="pointer-events-none absolute inset-0 z-10 film-grain opacity-40" />
      )}

      {/* Cinematic Vignette */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(11,8,6,0.8)_100%)]" />

      {/* Cinematic Intro Screen */}
      <CinematicIntro isVisible={isIntroVisible} onEnter={handleEnterIntro} />

      {/* Persistent Navigation & Telemetry HUD */}
      <NavigationHUD
        currentProgress={currentProgress}
        activeProject={activeProject}
        onJumpToCategory={handleJumpToCategory}
        onOpenProjectModal={(p) => setSelectedProject(p)}
        onOpenContactModal={() => setIsContactOpen(true)}
        audioActive={audioActive}
        onToggleAudio={handleToggleAudio}
        onScrollStep={handleScrollStep}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenRadar={() => setIsRadarOpen(true)}
        onOpenShowreel={() => setIsShowreelOpen(true)}
        onOpenFX={() => setIsFXOpen(true)}
        isAutopilot={isAutopilot}
        onToggleAutopilot={handleToggleAutopilot}
      />

      {/* 3D Screen Detailed Inspection Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenContact={() => {
          setSelectedProject(null);
          setIsContactOpen(true);
        }}
      />

      {/* Interactive Tech Terminal & Matrix Modal */}
      <TechTerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        onWarpToNode={handleWarpToNode}
      />

      {/* Minecraft Server Radar Modal */}
      <ServerRadarModal
        isOpen={isRadarOpen}
        onClose={() => setIsRadarOpen(false)}
      />

      {/* Motion VFX & Editing Showreel Modal */}
      <ShowreelModal
        isOpen={isShowreelOpen}
        onClose={() => setIsShowreelOpen(false)}
      />

      {/* Visual & Simulation FX Customizer Modal */}
      <FXControlsModal
        isOpen={isFXOpen}
        onClose={() => setIsFXOpen(false)}
        theme={theme}
        onChangeTheme={handleChangeTheme}
        isWireframe={isWireframe}
        onToggleWireframe={handleToggleWireframe}
        isAutopilot={isAutopilot}
        onToggleAutopilot={handleToggleAutopilot}
        hasScanlines={hasScanlines}
        onToggleScanlines={() => setHasScanlines(!hasScanlines)}
        audioActive={audioActive}
        onToggleAudio={handleToggleAudio}
      />

      {/* Contact Modal & Terminal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </main>
  );
}
