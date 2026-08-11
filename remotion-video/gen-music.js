// Generates a calm, original ambient pad track (public/music.wav, ~122s).
// Chords: Am7 - Fmaj7 - Cmaj7 - G, soft sine pads + sparse arpeggio.
const fs = require("fs");
const path = require("path");

const SR = 44100;
const DUR = 122;
const N = SR * DUR;

const midiToFreq = (m) => 440 * Math.pow(2, (m - 69) / 12);

// chord tones (midi): pad voicings
const CHORDS = [
  [45, 57, 60, 64, 67], // Am7  (A2 A3 C4 E4 G4)
  [41, 53, 57, 60, 64], // Fmaj7(F2 F3 A3 C4 E4)
  [36, 48, 55, 60, 64], // Cmaj7(C2 C3 G3 C4 E4)
  [43, 55, 59, 62, 67], // G    (G2 G3 B3 D4 G4)
];
const CHORD_DUR = 7.5; // seconds per chord

const left = new Float64Array(N);
const right = new Float64Array(N);

// ---- pads ----
for (let ci = 0; ci * CHORD_DUR < DUR; ci++) {
  const chord = CHORDS[ci % CHORDS.length];
  const t0 = ci * CHORD_DUR;
  const t1 = Math.min(t0 + CHORD_DUR, DUR);
  const s0 = Math.floor(t0 * SR);
  const s1 = Math.floor(t1 * SR);
  for (const m of chord) {
    const f = midiToFreq(m);
    const detL = f * 1.0008;
    const detR = f * 0.9992;
    const amp = m < 50 ? 0.16 : 0.09; // bass a bit louder
    for (let s = s0; s < s1; s++) {
      const t = s / SR;
      const tt = t - t0;
      const seg = t1 - t0;
      // slow attack/release envelope inside the chord segment
      const env =
        Math.min(1, tt / 2.2) * Math.min(1, (seg - tt) / 2.2);
      // two low harmonics for warmth
      const phL = 2 * Math.PI * detL * t;
      const phR = 2 * Math.PI * detR * t;
      const vL = (Math.sin(phL) + 0.35 * Math.sin(2 * phL)) * amp * env;
      const vR = (Math.sin(phR) + 0.35 * Math.sin(2 * phR)) * amp * env;
      left[s] += vL;
      right[s] += vR;
    }
  }
}

// ---- sparse arpeggio pluck (one chord tone every 1.875s, octave up) ----
for (let ci = 0; ci * CHORD_DUR < DUR; ci++) {
  const chord = CHORDS[ci % CHORDS.length].slice(1); // skip bass
  const t0 = ci * CHORD_DUR;
  for (let k = 0; k < 4; k++) {
    const noteT = t0 + k * 1.875 + 0.4;
    if (noteT >= DUR - 1.5) continue;
    const m = chord[(k + ci) % chord.length] + 12;
    const f = midiToFreq(m);
    const s0 = Math.floor(noteT * SR);
    const len = Math.floor(1.4 * SR);
    for (let i = 0; i < len && s0 + i < N; i++) {
      const t = i / SR;
      const env = Math.exp(-3.2 * t) * Math.min(1, t / 0.015);
      const v = Math.sin(2 * Math.PI * f * (s0 + i) / SR) * 0.05 * env;
      const pan = k % 2 === 0 ? 0.7 : 0.3;
      left[s0 + i] += v * pan;
      right[s0 + i] += v * (1 - pan);
    }
  }
}

// ---- master fade in/out + normalize ----
let peak = 0;
for (let s = 0; s < N; s++) {
  const fade =
    Math.min(1, (s / SR) / 3) * Math.min(1, (DUR - s / SR) / 6);
  left[s] *= fade;
  right[s] *= fade;
  peak = Math.max(peak, Math.abs(left[s]), Math.abs(right[s]));
}
const gain = 0.85 / peak;

// ---- write 16-bit stereo WAV ----
const dataBytes = N * 2 * 2;
const buf = Buffer.alloc(44 + dataBytes);
buf.write("RIFF", 0);
buf.writeUInt32LE(36 + dataBytes, 4);
buf.write("WAVE", 8);
buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20); // PCM
buf.writeUInt16LE(2, 22); // stereo
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32);
buf.writeUInt16LE(16, 34);
buf.write("data", 36);
buf.writeUInt32LE(dataBytes, 40);
for (let s = 0; s < N; s++) {
  buf.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(left[s] * gain * 32767))), 44 + s * 4);
  buf.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(right[s] * gain * 32767))), 46 + s * 4);
}
fs.writeFileSync(path.join(__dirname, "public", "music.wav"), buf);
console.log("wrote public/music.wav", (44 + dataBytes) / 1e6, "MB");
