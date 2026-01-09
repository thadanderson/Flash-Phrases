// A singleton or service to handle the audio context and precise scheduling
export type BackingStyle = 'rock-funk' | 'swing';

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private nextNoteTime: number = 0.0;
  private timerID: number | null = null;
  private isPlaying: boolean = false;
  
  // Configuration
  public tempo: number = 100;
  public enableBackingTrack: boolean = false;
  public style: BackingStyle = 'rock-funk';
  
  // Callbacks for UI updates
  public onBeat: ((beatNumber: number) => void) | null = null;

  // Internal state
  private currentBeatInBar: number = 0;
  private measureCount: number = 0; // To track chord progressions
  private lookahead: number = 25.0; // milliseconds
  private scheduleAheadTime: number = 0.1; // seconds

  // Frequencies for synthesis
  private notes: { [key: string]: number } = {
    'C2': 65.41, 'D2': 73.42, 'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'G2': 98.00, 'A2': 110.00, 'B2': 123.47,
    'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88
  };

  constructor() {}

  private ensureContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  public start() {
    this.ensureContext();
    this.isPlaying = true;
    this.currentBeatInBar = 0;
    // Start at -1 to allow for one measure of count-in (4 beats) where only the metronome plays.
    this.measureCount = -1; 
    
    if (this.audioContext) {
        this.nextNoteTime = this.audioContext.currentTime + 0.1;
    }
    
    this.scheduler();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerID !== null) {
      window.clearTimeout(this.timerID);
      this.timerID = null;
    }
  }

  public setTempo(bpm: number) {
    this.tempo = bpm;
  }

  public setBackingTrack(enabled: boolean) {
    this.enableBackingTrack = enabled;
  }

  public setStyle(style: BackingStyle) {
    this.style = style;
  }

  private nextNote() {
    const secondsPerBeat = 60.0 / this.tempo;
    this.nextNoteTime += secondsPerBeat; 
    
    this.currentBeatInBar++;
    if (this.currentBeatInBar === 4) {
      this.currentBeatInBar = 0;
      this.measureCount++;
    }
  }

  // --- SYNTHESIS METHODS ---

  private playMetronomeClick(time: number, beatNumber: number) {
    if (!this.audioContext) return;
    const osc = this.audioContext.createOscillator();
    const env = this.audioContext.createGain();

    osc.connect(env);
    env.connect(this.audioContext.destination);

    osc.frequency.value = beatNumber === 0 ? 880 : 440;
    env.gain.value = 0.5;
    env.gain.exponentialRampToValueAtTime(0.5, time + 0.001);
    env.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    osc.start(time);
    osc.stop(time + 0.06);
  }

  private playBass(time: number, freq: number, duration: number, isShort: boolean = false) {
    if (!this.audioContext) return;
    const osc = this.audioContext.createOscillator();
    const env = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    // Bass sound chain: Osc -> Filter -> Env -> Dest
    osc.type = 'sawtooth';
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    osc.connect(filter);
    filter.connect(env);
    env.connect(this.audioContext.destination);

    osc.frequency.value = freq;

    const attack = 0.02;
    const release = isShort ? 0.1 : duration * 0.8;

    env.gain.value = 0;
    env.gain.linearRampToValueAtTime(0.3, time + attack);
    env.gain.linearRampToValueAtTime(0, time + release);

    osc.start(time);
    osc.stop(time + release + 0.1);
  }

  private playPiano(time: number, freqs: number[], duration: number) {
    if (!this.audioContext) return;
    
    // Simple polyphonic synth
    freqs.forEach(f => {
        const osc = this.audioContext!.createOscillator();
        const env = this.audioContext!.createGain();
        
        osc.type = 'triangle'; // Triangle is decent for "electric piano" vibe
        
        osc.connect(env);
        env.connect(this.audioContext!.destination);
        
        osc.frequency.value = f;
        
        env.gain.value = 0;
        env.gain.linearRampToValueAtTime(0.1, time + 0.01);
        env.gain.exponentialRampToValueAtTime(0.001, time + duration); // Decay
        
        osc.start(time);
        osc.stop(time + duration + 0.1);
    });
  }

  // --- SCHEDULING LOGIC ---

  private scheduleNote(beatNumber: number, time: number) {
    if (!this.audioContext) return;

    const beatDuration = 60.0 / this.tempo;

    // Always play click
    this.playMetronomeClick(time, beatNumber);

    // Backing Track Logic
    // Only play instruments if backing track is enabled AND we are past the count-in measure (-1)
    if (this.enableBackingTrack && this.measureCount >= 0) {
        if (this.style === 'rock-funk') {
            this.scheduleRock(beatNumber, time, beatDuration);
        } else {
            this.scheduleSwing(beatNumber, time, beatDuration);
        }
    }

    // UI Callback
    const timeUntilNote = (time - this.audioContext.currentTime) * 1000;
    setTimeout(() => {
        if (this.isPlaying && this.onBeat) {
            this.onBeat(beatNumber);
        }
    }, Math.max(0, timeUntilNote));
  }

  private scheduleRock(beat: number, time: number, duration: number) {
    // 4-Bar Loop: C (I) | F (IV) | C (I) | G (V)
    const progIndex = this.measureCount % 4;
    let root = this.notes['C3'];
    let chord = [this.notes['C4'], this.notes['E4'], this.notes['G4']];

    if (progIndex === 1) { // F
        root = this.notes['F2'];
        chord = [this.notes['F4'], this.notes['A4'], this.notes['C4']]; // Inversion
    } else if (progIndex === 3) { // G
        root = this.notes['G2'];
        chord = [this.notes['G4'], this.notes['B4'], this.notes['D4']]; // Inversion
    }

    // Bass: Driving Quarter notes (Root - Root - Root - Root)
    // Actually, let's do Root on 1 and 3, Fifth on 2 and 4 for more movement
    let bassNote = root;
    if (beat === 1 || beat === 3) {
        // Simple fifth up logic roughly
        bassNote = root * 1.5; 
    }
    
    // Play bass on every beat
    this.playBass(time, root, duration);
    
    // Piano: Chords on beat 1
    if (beat === 0) {
        this.playPiano(time, chord, duration * 2);
    }
    // Staccato hits on beat 2+ (the "and" of 2) or similar could be added, but keeping it simple
  }

  private scheduleSwing(beat: number, time: number, duration: number) {
    // 4-Bar Loop: Dm7 | G7 | Cmaj7 | Cmaj7
    const progIndex = this.measureCount % 4;
    let bassNote = this.notes['C3'];
    let chord = [this.notes['C4'], this.notes['E4'], this.notes['G4']];

    // Determine Bass Note for Walking Line
    if (progIndex === 0) { // Dm7
        chord = [this.notes['F4'], this.notes['A4'], this.notes['C4']]; // F A C (Dm7 shell)
        if (beat === 0) bassNote = this.notes['D3'];
        else if (beat === 1) bassNote = this.notes['E3'];
        else if (beat === 2) bassNote = this.notes['F3'];
        else bassNote = this.notes['F#3']; // Leading to G
    } else if (progIndex === 1) { // G7
        chord = [this.notes['F4'], this.notes['B4'], this.notes['D4']]; // F B D (G7 shell)
        if (beat === 0) bassNote = this.notes['G3'];
        else if (beat === 1) bassNote = this.notes['F3'];
        else if (beat === 2) bassNote = this.notes['D3'];
        else bassNote = this.notes['B2']; // Leading to C
    } else { // Cmaj7
        chord = [this.notes['E4'], this.notes['G4'], this.notes['B4']]; // E G B (Cmaj7 shell)
        if (beat === 0) bassNote = this.notes['C3'];
        else if (beat === 1) bassNote = this.notes['D3'];
        else if (beat === 2) bassNote = this.notes['E3'];
        else bassNote = this.notes['G3'];
    }

    // Bass: Walking Quarter notes
    this.playBass(time, bassNote, duration * 0.8, false);

    // Piano: Comping rhythm
    // Swing math: The "and" of a beat is at time + (2/3 * duration)
    const swingOffset = duration * (2/3);

    // Charleston Rhythm: Beat 1 (dotted quarter) + Beat 2 'and' (eighth)
    if (beat === 0) {
         this.playPiano(time, chord, duration * 0.5);
    }
    if (beat === 1) {
         this.playPiano(time + swingOffset, chord, duration * 0.5);
    }
  }

  private scheduler() {
    if (!this.audioContext) return;

    while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.currentBeatInBar, this.nextNoteTime);
      this.nextNote();
    }

    if (this.isPlaying) {
      this.timerID = window.setTimeout(() => this.scheduler(), this.lookahead);
    }
  }
}

export const audioEngine = new AudioEngine();