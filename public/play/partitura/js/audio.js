window.Partitura = window.Partitura || {};

(function (ns) {
  'use strict';

  const LOOKAHEAD_MS = 25;
  const SCHEDULE_AHEAD = 0.18;

  let ctx = null;
  let master = null;
  let volume = 0.8;

  let timer = null;
  let queue = [];
  let cursor = 0;
  let startAt = 0;
  let endsAt = 0;
  let handlers = {};

  function ensure() {
    if (!ctx) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
      master = ctx.createGain();
      master.gain.value = volume;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  function voice(at, midi, seconds, velocity) {
    const freq = midiToFreq(midi);
    const amp = ctx.createGain();
    const tone = ctx.createBiquadFilter();

    tone.type = 'lowpass';
    tone.frequency.setValueAtTime(4600, at);
    tone.frequency.exponentialRampToValueAtTime(760, at + Math.max(0.2, seconds));

    const parts = [
      { type: 'triangle', mul: 1, gain: 1 },
      { type: 'sine', mul: 2, gain: 0.32 },
      { type: 'sine', mul: 3.01, gain: 0.1 },
    ];

    parts.forEach(function (part) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = part.type;
      osc.frequency.setValueAtTime(freq * part.mul, at);
      gain.gain.setValueAtTime(part.gain, at);
      osc.connect(gain).connect(tone);
      osc.start(at);
      osc.stop(at + seconds + 0.4);
    });

    const peak = 0.28 * (velocity === undefined ? 1 : velocity);
    amp.gain.setValueAtTime(0.0001, at);
    amp.gain.exponentialRampToValueAtTime(peak, at + 0.008);
    amp.gain.exponentialRampToValueAtTime(peak * 0.34, at + Math.min(0.6, seconds * 0.6));
    amp.gain.exponentialRampToValueAtTime(0.0001, at + seconds + 0.32);

    tone.connect(amp).connect(master);
  }

  function note(midi, seconds) {
    if (!ensure()) return;
    voice(ctx.currentTime + 0.001, midi, seconds || 0.6, 1);
  }

  function setVolume(value) {
    volume = Math.max(0, Math.min(1, value));
    if (master) master.gain.setTargetAtTime(volume, ctx.currentTime, 0.02);
  }

  function build(score) {
    const sc = ns.score;
    const per = sc.tickSeconds(score);
    const out = [];
    let tick = 0;

    score.events.forEach(function (event, index) {
      const ticks = sc.ticksOf(event);
      out.push({
        index: index,
        at: tick * per,
        seconds: ticks * per,
        pitches: sc.isRest(event)
          ? []
          : event.notes.map(function (n) {
              return sc.midiOfNote(n, score.fifths);
            }),
      });
      tick += ticks;
    });

    return { items: out, total: tick * per };
  }

  function tick() {
    if (!ctx) return;
    const now = ctx.currentTime;

    while (cursor < queue.length && startAt + queue[cursor].at < now + SCHEDULE_AHEAD) {
      const item = queue[cursor];
      item.pitches.forEach(function (pitch) {

        voice(startAt + item.at, pitch, item.seconds * 0.98, 1);
      });
      cursor++;
    }

    if (handlers.onEvent) {
      let current = null;
      for (let i = 0; i < queue.length; i++) {
        if (startAt + queue[i].at <= now) current = queue[i].index;
        else break;
      }
      if (current !== handlers._last) {
        handlers._last = current;
        handlers.onEvent(current);
      }
    }

    if (now >= endsAt) stop();
  }

  function play(score, callbacks) {
    if (!ensure()) return false;
    stop();

    const built = build(score);
    if (!built.items.length) return false;

    queue = built.items;
    cursor = 0;
    handlers = callbacks || {};
    handlers._last = undefined;
    startAt = ctx.currentTime + 0.12;
    endsAt = startAt + built.total + 0.25;

    timer = setInterval(tick, LOOKAHEAD_MS);
    tick();
    return true;
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
      const done = handlers.onStop;
      queue = [];
      cursor = 0;
      handlers = {};
      if (done) done();
    }
  }

  function isPlaying() {
    return Boolean(timer);
  }

  ns.audio = {
    ensure: ensure,
    note: note,
    play: play,
    stop: stop,
    isPlaying: isPlaying,
    setVolume: setVolume,
    midiToFreq: midiToFreq,
  };
})(window.Partitura);
