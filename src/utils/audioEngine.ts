/**
 * Audio Engine: High-fidelity MP3 Background Score ("Attention" by Charlie Puth)
 * and Spatial Web Audio UI Sound Effects.
 */
class AmbientSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private sfxEnabled: boolean = true;

  // Background MP3 Music Engine
  private bgMusic: HTMLAudioElement | null = null;
  private isMusicPlaying: boolean = false;
  private musicVolume: number = 0.4; // 40% volume as requested
  private musicListeners: Set<(playing: boolean) => void> = new Set();
  private volumeListeners: Set<(volume: number) => void> = new Set();

  public init() {
    // 1. Initialize Web Audio Context for UI Sound Effects
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        this.sfxGain.connect(this.ctx.destination);
      }
    }

    // 2. Initialize MP3 Audio Track
    if (!this.bgMusic && typeof Audio !== 'undefined') {
      try {
        const audio = new Audio('/audio/attention.mp3');
        audio.loop = true;
        audio.volume = this.musicVolume;
        audio.preload = 'auto';

        audio.addEventListener('play', () => {
          this.isMusicPlaying = true;
          this.notifyListeners(true);
        });

        audio.addEventListener('pause', () => {
          this.isMusicPlaying = false;
          this.notifyListeners(false);
        });

        audio.addEventListener('ended', () => {
          this.isMusicPlaying = false;
          this.notifyListeners(false);
        });

        // Error fallback to root attention.mp3 if /audio/ is unreachable
        audio.addEventListener('error', () => {
          if (audio.src.endsWith('/audio/attention.mp3')) {
            audio.src = '/attention.mp3';
            audio.load();
            if (this.isMusicPlaying) {
              audio.play().catch(() => {});
            }
          }
        });

        this.bgMusic = audio;
      } catch (err) {
        console.warn('Audio initialization notice:', err);
      }
    }
  }

  /** Subscribe to music play/pause state changes */
  public subscribe(callback: (playing: boolean) => void): () => void {
    this.musicListeners.add(callback);
    callback(this.isMusicPlaying);
    return () => this.musicListeners.delete(callback);
  }

  private notifyListeners(playing: boolean) {
    this.musicListeners.forEach((cb) => {
      try {
        cb(playing);
      } catch (e) {}
    });
  }

  /**
   * Plays the MP3 track on website entry or user interaction.
   * Resolves whether playback began or was deferred by browser autoplay restrictions.
   */
  public async play(): Promise<boolean> {
    this.init();

    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (e) {}
    }

    if (!this.bgMusic) return false;

    try {
      this.bgMusic.volume = this.musicVolume;
      await this.bgMusic.play();
      this.isMusicPlaying = true;
      this.notifyListeners(true);
      return true;
    } catch (error) {
      // Browser autoplay policy might block sound until user gesture
      this.isMusicPlaying = false;
      this.notifyListeners(false);
      return false;
    }
  }

  /** Pauses the MP3 track */
  public stop() {
    if (this.bgMusic) {
      this.bgMusic.pause();
    }
    this.isMusicPlaying = false;
    this.notifyListeners(false);
  }

  /** Toggles MP3 track between play and pause */
  public toggle(): boolean {
    if (this.isMusicPlaying) {
      this.stop();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isMusicPlaying;
  }

  public setVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.bgMusic) {
      this.bgMusic.volume = this.musicVolume;
    }
    this.volumeListeners.forEach((cb) => {
      try {
        cb(this.musicVolume);
      } catch (e) {}
    });
  }

  public getVolume(): number {
    return this.musicVolume;
  }

  public subscribeVolume(callback: (vol: number) => void): () => void {
    this.volumeListeners.add(callback);
    callback(this.musicVolume);
    return () => this.volumeListeners.delete(callback);
  }

  // --- Spatial Tactile Sound Effects ---

  /**
   * Crisp, tactile mechanical UI button click with subtle pitch randomization
   * and dual transient-body punch.
   */
  public playButtonClick() {
    this.init();
    if (!this.ctx || !this.sfxGain || !this.sfxEnabled) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;

    // Component 1: High crisp mechanical transient
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    const pitchOffset = (Math.random() - 0.5) * 160;
    const startFreq = Math.max(800, 1650 + pitchOffset);

    clickOsc.type = 'sine';
    clickOsc.frequency.setValueAtTime(startFreq, t);
    clickOsc.frequency.exponentialRampToValueAtTime(320, t + 0.025);

    clickGain.gain.setValueAtTime(0.07, t);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.028);

    clickOsc.connect(clickGain);
    clickGain.connect(this.sfxGain);

    clickOsc.start(t);
    clickOsc.stop(t + 0.03);

    // Component 2: Subtle warm body thud
    const bodyOsc = this.ctx.createOscillator();
    const bodyGain = this.ctx.createGain();

    bodyOsc.type = 'triangle';
    bodyOsc.frequency.setValueAtTime(240, t);
    bodyOsc.frequency.exponentialRampToValueAtTime(75, t + 0.035);

    bodyGain.gain.setValueAtTime(0.045, t);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.038);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(this.sfxGain);

    bodyOsc.start(t);
    bodyOsc.stop(t + 0.04);
  }

  /**
   * Holographic dimensional chime & resonant sweep when clicking any card.
   * Gives tactile feedback of selecting or opening a 3D datum card or content module.
   */
  public playCardClick() {
    this.init();
    if (!this.ctx || !this.sfxGain || !this.sfxEnabled) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;

    // High harmonic chime pair (F#5: 739.99 Hz, C#6: 1108.73 Hz, E6: 1318.51 Hz)
    const tones = [739.99, 1108.73, 1318.51];
    tones.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.018);

      gain.gain.setValueAtTime(0.001, t + idx * 0.018);
      gain.gain.linearRampToValueAtTime(0.05 / (idx + 1), t + idx * 0.018 + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.018 + 0.32);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + idx * 0.018);
      osc.stop(t + idx * 0.018 + 0.35);
    });

    // Warm sub-swell sweep
    const subOsc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const subGain = this.ctx.createGain();

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(130, t);
    subOsc.frequency.exponentialRampToValueAtTime(260, t + 0.16);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, t);
    filter.frequency.exponentialRampToValueAtTime(650, t + 0.12);

    subGain.gain.setValueAtTime(0.035, t);
    subGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

    subOsc.connect(filter);
    filter.connect(subGain);
    subGain.connect(this.sfxGain);

    subOsc.start(t);
    subOsc.stop(t + 0.24);
  }

  /** Soft micro-click for card or UI element hover */
  public playHoverTick() {
    this.init();
    if (!this.ctx || !this.sfxGain || !this.sfxEnabled) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(700, t + 0.04);

    gain.gain.setValueAtTime(0.03, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  /** Deep whoosh / warp riser when navigating between 3D nodes */
  public playNodeWarp() {
    this.init();
    if (!this.ctx || !this.sfxGain || !this.sfxEnabled) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.25);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, t);
    filter.frequency.exponentialRampToValueAtTime(600, t + 0.18);
    filter.frequency.exponentialRampToValueAtTime(180, t + 0.35);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.08, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.36);
  }

  /** Harmonic crystal chime when opening project inspection modal */
  public playInspectChime() {
    this.init();
    if (!this.ctx || !this.sfxGain || !this.sfxEnabled) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    const chords = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    chords.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.035);

      gain.gain.setValueAtTime(0.001, t + idx * 0.035);
      gain.gain.linearRampToValueAtTime(0.045, t + idx * 0.035 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.035 + 0.7);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + idx * 0.035);
      osc.stop(t + idx * 0.035 + 0.75);
    });
  }

  /** Positive dual-tone confirmation when copying server IP or Discord tag */
  public playCopySuccess() {
    this.init();
    if (!this.ctx || !this.sfxGain || !this.sfxEnabled) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    const tones = [880, 1318.51]; // A5, E6

    tones.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.09);

      gain.gain.setValueAtTime(0.06, t + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.09 + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + idx * 0.09);
      osc.stop(t + idx * 0.09 + 0.32);
    });
  }

  /** Subtle mechanical keystroke click for terminal typing */
  public playTerminalKey() {
    this.init();
    if (!this.ctx || !this.sfxGain || !this.sfxEnabled) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const pitch = 850 + Math.random() * 250;
    osc.frequency.setValueAtTime(pitch, t);
    osc.frequency.exponentialRampToValueAtTime(350, t + 0.025);

    gain.gain.setValueAtTime(0.02, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.03);
  }

  /** High-tech sonar ping for server diagnostics radar */
  public playRadarPing() {
    this.init();
    if (!this.ctx || !this.sfxGain || !this.sfxEnabled) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1860, t);
    osc.frequency.exponentialRampToValueAtTime(1750, t + 0.2);

    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.26);
  }
}

export const ambientSynth = new AmbientSynthesizer();
