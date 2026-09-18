// Web Audio API helper for zero-dependency, crystal-clear cozy sounds

class AudioManager {
  private ctx: AudioContext | null = null;
  private noiseNodes: Map<string, { gainNode: GainNode; sourceNode?: AudioNode }> = new Map();

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Soft, gentle and peaceful chime/bell for timer completion (Task 2.3)
  playBellSound() {
    try {
      const audio = new Audio('/chime.wav');
      audio.volume = 0.45;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          this.synthesizeBellSound();
        });
        return;
      }
    } catch {
      // Fallback to Web Audio synthesis
    }
    this.synthesizeBellSound();
  }

  // Synthesizes an organic, warm two-stroke Tibetan singing bowl & chime with zero click
  synthesizeBellSound() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Two harmonious mindfulness tones:
      // Note 1: E5 (659.25 Hz) - gentle singing bowl strike
      // Note 2: B5 (987.77 Hz) - 280ms later, peaceful perfect-fifth chime
      const strikes = [
        { time: now, f0: 659.25, gain: 0.22, duration: 2.8 },
        { time: now + 0.28, f0: 987.77, gain: 0.26, duration: 3.2 }
      ];

      strikes.forEach(({ time, f0, gain: strikeGain, duration }) => {
        // Master gain for this strike with a smooth 18ms attack (prevents any digital click/pop)
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.0001, time);
        masterGain.gain.linearRampToValueAtTime(strikeGain, time + 0.018);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

        // Low-pass filter to ensure soft, warm, non-piercing timbre
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400, time);
        filter.Q.setValueAtTime(0.7, time);

        // 1. Fundamental tone (warm sine wave)
        const oscFundamental = ctx.createOscillator();
        oscFundamental.type = 'sine';
        oscFundamental.frequency.setValueAtTime(f0, time);

        // 2. Detuned oscillator for gentle acoustic beating / chorus (soothing singing bowl effect)
        const oscBeating = ctx.createOscillator();
        const gainBeating = ctx.createGain();
        oscBeating.type = 'sine';
        oscBeating.frequency.setValueAtTime(f0 + 1.2, time);
        gainBeating.gain.setValueAtTime(0.25, time);
        oscBeating.connect(gainBeating);
        gainBeating.connect(filter);

        // 3. Sub-octave resonance (deep body of the bowl)
        const oscSub = ctx.createOscillator();
        const gainSub = ctx.createGain();
        oscSub.type = 'sine';
        oscSub.frequency.setValueAtTime(f0 * 0.5, time);
        gainSub.gain.setValueAtTime(0.18, time);
        gainSub.gain.exponentialRampToValueAtTime(0.0001, time + duration * 0.6);
        oscSub.connect(gainSub);
        gainSub.connect(filter);

        // 4. Soft inharmonic chime overtone
        const oscOvertone = ctx.createOscillator();
        const gainOvertone = ctx.createGain();
        oscOvertone.type = 'sine';
        oscOvertone.frequency.setValueAtTime(f0 * 2.76, time);
        gainOvertone.gain.setValueAtTime(0.08, time);
        gainOvertone.gain.exponentialRampToValueAtTime(0.0001, time + duration * 0.4);
        oscOvertone.connect(gainOvertone);
        gainOvertone.connect(filter);

        // Connect fundamental to filter
        oscFundamental.connect(filter);

        // Route filter -> masterGain -> destination
        filter.connect(masterGain);
        masterGain.connect(ctx.destination);

        // Start & stop cleanly
        const stopTime = time + duration + 0.1;
        oscFundamental.start(time);
        oscFundamental.stop(stopTime);
        oscBeating.start(time);
        oscBeating.stop(stopTime);
        oscSub.start(time);
        oscSub.stop(stopTime);
        oscOvertone.start(time);
        oscOvertone.stop(stopTime);
      });
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  // Gentle button click / tick feedback
  playSoftClick() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignore
    }
  }

  // Continuous procedural ambient sounds (Rain, Fireplace crackle, Cozy Wind)
  toggleAmbient(type: 'rain' | 'fire' | 'wind', play: boolean, volume: number = 0.5) {
    const ctx = this.getContext();

    if (!play) {
      const existing = this.noiseNodes.get(type);
      if (existing) {
        existing.gainNode.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
        setTimeout(() => {
          this.noiseNodes.delete(type);
        }, 600);
      }
      return;
    }

    // If already playing, just update volume
    const existing = this.noiseNodes.get(type);
    if (existing) {
      existing.gainNode.gain.linearRampToValueAtTime(Math.max(0.001, volume * 0.3), ctx.currentTime + 0.1);
      return;
    }

    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    if (type === 'rain') {
      // Pink / brown filtered noise for rain drops
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99765 * b0 + white * 0.0990460;
        b1 = 0.96300 * b1 + white * 0.1342928;
        b2 = 0.86650 * b2 + white * 0.1873837;
        output[i] = (b0 + b1 + b2) * 0.1;
      }
    } else if (type === 'fire') {
      // Fire crackle with low rumble and intermittent tiny pops
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        const pop = Math.random() > 0.9992 ? (Math.random() * 0.8 - 0.4) : 0;
        lastOut = 0.94 * lastOut + white * 0.06;
        output[i] = (lastOut * 0.3 + pop);
      }
    } else {
      // Warm gentle wind / room presence
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = 0.98 * lastOut + white * 0.04;
        output[i] = lastOut * 0.25;
      }
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter
    const filter = ctx.createBiquadFilter();
    if (type === 'rain') {
      filter.type = 'lowpass';
      filter.frequency.value = 1200;
    } else if (type === 'fire') {
      filter.type = 'bandpass';
      filter.frequency.value = 600;
      filter.Q.value = 1.2;
    } else {
      filter.type = 'lowpass';
      filter.frequency.value = 400;
    }

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(Math.max(0.001, volume * 0.25), ctx.currentTime + 0.5);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    whiteNoise.start();
    this.noiseNodes.set(type, { gainNode, sourceNode: whiteNoise });
  }

  setAmbientVolume(type: 'rain' | 'fire' | 'wind', volume: number) {
    const existing = this.noiseNodes.get(type);
    if (existing && this.ctx) {
      existing.gainNode.gain.linearRampToValueAtTime(Math.max(0.0001, volume * 0.25), this.ctx.currentTime + 0.05);
    }
  }
}

export const audioManager = new AudioManager();
