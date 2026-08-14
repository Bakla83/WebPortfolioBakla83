window.Oktava = window.Oktava || {};

(function (ns) {
  'use strict';

  const PENTA = [0, 3, 5, 7, 10];

  const ROOT_MIDI = 48;

  const ROWS = 10;

  const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const DRUM_KINDS = ['kick', 'snare', 'hat', 'clap'];

  function rowToMidi(row) {
    return ROOT_MIDI + Math.floor(row / PENTA.length) * 12 + PENTA[row % PENTA.length];
  }

  function midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  function rowLabel(row) {
    const midi = rowToMidi(row);
    return NOTE_NAMES[midi % 12] + (Math.floor(midi / 12) - 1);
  }

  const noiseCache = new WeakMap();
  const pluckCache = new WeakMap();

  function noiseBuffer(ctx) {
    let buf = noiseCache.get(ctx);
    if (buf) return buf;

    const len = Math.ceil(ctx.sampleRate * 1.2);
    buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

    noiseCache.set(ctx, buf);
    return buf;
  }

  function pluckBuffer(ctx, freq, seconds, damping) {
    let cache = pluckCache.get(ctx);
    if (!cache) {
      cache = new Map();
      pluckCache.set(ctx, cache);
    }

    const key = freq.toFixed(1) + '|' + seconds.toFixed(2) + '|' + damping;
    const hit = cache.get(key);
    if (hit) return hit;

    const sr = ctx.sampleRate;
    const period = Math.max(2, Math.round(sr / freq));
    const len = Math.max(period + 2, Math.ceil(seconds * sr));

    const buf = ctx.createBuffer(1, len, sr);
    const d = buf.getChannelData(0);

    for (let i = 0; i < period; i++) d[i] = Math.random() * 2 - 1;
    for (let i = period; i < len; i++) {
      d[i] = (d[i - period] + d[i - period + 1]) * 0.5 * damping;
    }

    cache.set(key, buf);
    return buf;
  }

  function decay(param, ctx, t0, peak, seconds) {
    param.cancelScheduledValues(t0);
    param.setValueAtTime(0.0001, t0);
    param.exponentialRampToValueAtTime(peak, t0 + 0.006);
    param.exponentialRampToValueAtTime(0.0001, t0 + seconds);
  }

  function voicePiano(ctx, out, freq, t0, dur, vel) {
    const amp = ctx.createGain();
    const tone = ctx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.setValueAtTime(4200, t0);
    tone.frequency.exponentialRampToValueAtTime(900, t0 + dur);

    const parts = [
      { type: 'triangle', mul: 1, gain: 1 },
      { type: 'sine', mul: 2, gain: 0.34 },
      { type: 'sine', mul: 3.01, gain: 0.11 },
    ];

    parts.forEach(function (p) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = p.type;
      osc.frequency.setValueAtTime(freq * p.mul, t0);
      g.gain.setValueAtTime(p.gain, t0);
      osc.connect(g).connect(tone);
      osc.start(t0);
      osc.stop(t0 + dur + 0.05);
    });

    decay(amp.gain, ctx, t0, 0.5 * vel, dur);
    tone.connect(amp).connect(out);
  }

  function voiceGuitar(ctx, out, freq, t0, dur, vel) {
    const src = ctx.createBufferSource();
    src.buffer = pluckBuffer(ctx, freq, Math.max(dur, 0.9), 0.9965);

    const amp = ctx.createGain();
    amp.gain.setValueAtTime(0.9 * vel, t0);
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + Math.max(dur, 0.35));

    const body = ctx.createBiquadFilter();
    body.type = 'bandpass';
    body.frequency.setValueAtTime(Math.min(freq * 2.4, 3200), t0);
    body.Q.setValueAtTime(0.7, t0);

    src.connect(body).connect(amp).connect(out);
    src.start(t0);
    src.stop(t0 + Math.max(dur, 0.9) + 0.05);
  }

  function voiceBell(ctx, out, freq, t0, dur, vel) {

    const carrier = ctx.createOscillator();
    const mod = ctx.createOscillator();
    const modGain = ctx.createGain();
    const amp = ctx.createGain();

    carrier.type = 'sine';
    mod.type = 'sine';
    carrier.frequency.setValueAtTime(freq, t0);
    mod.frequency.setValueAtTime(freq * 3.47, t0);

    modGain.gain.setValueAtTime(freq * 2.2, t0);
    modGain.gain.exponentialRampToValueAtTime(freq * 0.05, t0 + Math.max(dur, 0.6));

    const life = Math.max(dur, 0.9);
    decay(amp.gain, ctx, t0, 0.34 * vel, life);

    mod.connect(modGain).connect(carrier.frequency);
    carrier.connect(amp).connect(out);

    mod.start(t0);
    carrier.start(t0);
    mod.stop(t0 + life + 0.05);
    carrier.stop(t0 + life + 0.05);
  }

  function voiceBass(ctx, out, freq, t0, dur, vel) {
    const low = freq / 2;
    const amp = ctx.createGain();

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.setValueAtTime(6, t0);
    filter.frequency.setValueAtTime(1100, t0);
    filter.frequency.exponentialRampToValueAtTime(180, t0 + Math.min(dur, 0.5));

    const saw = ctx.createOscillator();
    saw.type = 'sawtooth';
    saw.frequency.setValueAtTime(low, t0);

    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(low, t0);
    subGain.gain.setValueAtTime(0.6, t0);

    decay(amp.gain, ctx, t0, 0.62 * vel, dur);

    saw.connect(filter).connect(amp);
    sub.connect(subGain).connect(amp);
    amp.connect(out);

    saw.start(t0);
    sub.start(t0);
    saw.stop(t0 + dur + 0.05);
    sub.stop(t0 + dur + 0.05);
  }

  function voiceDrum(ctx, out, kind, t0, vel) {
    if (kind === 'kick') {
      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      osc.type = 'sine';

      osc.frequency.setValueAtTime(145, t0);
      osc.frequency.exponentialRampToValueAtTime(44, t0 + 0.09);
      decay(amp.gain, ctx, t0, 1.0 * vel, 0.34);
      osc.connect(amp).connect(out);
      osc.start(t0);
      osc.stop(t0 + 0.4);
      return;
    }

    if (kind === 'hat') {
      const src = ctx.createBufferSource();
      const hp = ctx.createBiquadFilter();
      const amp = ctx.createGain();
      src.buffer = noiseBuffer(ctx);
      hp.type = 'highpass';
      hp.frequency.setValueAtTime(7600, t0);
      decay(amp.gain, ctx, t0, 0.24 * vel, 0.055);
      src.connect(hp).connect(amp).connect(out);
      src.start(t0);
      src.stop(t0 + 0.12);
      return;
    }

    if (kind === 'clap') {

      [0, 0.013, 0.027].forEach(function (offset, i) {
        const src = ctx.createBufferSource();
        const bp = ctx.createBiquadFilter();
        const amp = ctx.createGain();
        src.buffer = noiseBuffer(ctx);
        bp.type = 'bandpass';
        bp.frequency.setValueAtTime(1150, t0);
        bp.Q.setValueAtTime(1.4, t0);
        decay(amp.gain, ctx, t0 + offset, (i === 2 ? 0.42 : 0.26) * vel, i === 2 ? 0.16 : 0.05);
        src.connect(bp).connect(amp).connect(out);
        src.start(t0 + offset);
        src.stop(t0 + offset + 0.2);
      });
      return;
    }

    const src = ctx.createBufferSource();
    const bp = ctx.createBiquadFilter();
    const amp = ctx.createGain();
    src.buffer = noiseBuffer(ctx);
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(1750, t0);
    bp.Q.setValueAtTime(0.9, t0);
    decay(amp.gain, ctx, t0, 0.5 * vel, 0.2);
    src.connect(bp).connect(amp).connect(out);
    src.start(t0);
    src.stop(t0 + 0.3);

    const tone = ctx.createOscillator();
    const toneAmp = ctx.createGain();
    tone.type = 'triangle';
    tone.frequency.setValueAtTime(190, t0);
    decay(toneAmp.gain, ctx, t0, 0.28 * vel, 0.11);
    tone.connect(toneAmp).connect(out);
    tone.start(t0);
    tone.stop(t0 + 0.2);
  }

  const VOICES = {
    piano: voicePiano,
    guitar: voiceGuitar,
    bell: voiceBell,
    bass: voiceBass,
  };

  function play(ctx, out, instrument, row, t0, dur, vel) {
    if (instrument === 'drums') {
      const kind = DRUM_KINDS[row];
      if (kind) voiceDrum(ctx, out, kind, t0, vel === undefined ? 1 : vel);
      return;
    }

    const voice = VOICES[instrument] || voicePiano;
    voice(ctx, out, midiToFreq(rowToMidi(row)), t0, dur, vel === undefined ? 1 : vel);
  }

  function click(ctx, out, t0, strong) {
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(strong ? 1600 : 1050, t0);
    decay(amp.gain, ctx, t0, strong ? 0.18 : 0.09, 0.045);
    osc.connect(amp).connect(out);
    osc.start(t0);
    osc.stop(t0 + 0.1);
  }

  function encodeWav(buffer) {
    const channels = buffer.numberOfChannels;
    const frames = buffer.length;
    const bytes = 44 + frames * channels * 2;
    const view = new DataView(new ArrayBuffer(bytes));

    let pos = 0;
    const str = (s) => {
      for (let i = 0; i < s.length; i++) view.setUint8(pos++, s.charCodeAt(i));
    };
    const u32 = (v) => {
      view.setUint32(pos, v, true);
      pos += 4;
    };
    const u16 = (v) => {
      view.setUint16(pos, v, true);
      pos += 2;
    };

    str('RIFF');
    u32(bytes - 8);
    str('WAVE');
    str('fmt ');
    u32(16);
    u16(1);
    u16(channels);
    u32(buffer.sampleRate);
    u32(buffer.sampleRate * channels * 2);
    u16(channels * 2);
    u16(16);
    str('data');
    u32(frames * channels * 2);

    const data = [];
    for (let c = 0; c < channels; c++) data.push(buffer.getChannelData(c));

    for (let i = 0; i < frames; i++) {
      for (let c = 0; c < channels; c++) {

        let s = data[c][i];
        if (s > 1) s = 1;
        else if (s < -1) s = -1;
        view.setInt16(pos, s * 32767, true);
        pos += 2;
      }
    }

    return new Blob([view.buffer], { type: 'audio/wav' });
  }

  ns.audio = {
    ROWS: ROWS,
    PENTA: PENTA,
    DRUM_KINDS: DRUM_KINDS,
    rowToMidi: rowToMidi,
    midiToFreq: midiToFreq,
    rowLabel: rowLabel,
    play: play,
    click: click,
    encodeWav: encodeWav,
  };
})(window.Oktava);
