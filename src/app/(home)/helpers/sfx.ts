// tiny Web Audio SFX — oscillator blips, no assets
let ctx: AudioContext | null = null;
let enabled = true;

export function setSfxEnabled(value: boolean) {
    enabled = value;
}

function ac(): AudioContext | null {
    if (typeof window === "undefined") return null;
    try {
        if (!ctx) {
            ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        }
        if (ctx.state === "suspended") void ctx.resume();
        return ctx;
    } catch {
        return null;
    }
}

function tone(freq: number, dur = 0.08, type: OscillatorType = "square", vol = 0.04, delay = 0) {
    const audio = ac();
    if (!audio || !enabled) return;
    const t = audio.currentTime + delay;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(audio.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
}

export const sfx = {
    flip: () => tone(520, 0.05),
    match: () => { tone(660, 0.08); tone(880, 0.1, "square", 0.04, 0.09); },
    miss: () => tone(180, 0.18, "sawtooth", 0.05),
    peek: () => { tone(440, 0.1, "triangle", 0.05); tone(660, 0.1, "triangle", 0.05, 0.08); },
    win: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.12, "square", 0.05, i * 0.1)),
    lose: () => [400, 300, 200].forEach((f, i) => tone(f, 0.16, "sawtooth", 0.05, i * 0.12)),
};
