window.Partitura = window.Partitura || {};

(function (ns) {
  'use strict';

  const WHOLE = 32;

  const DURATIONS = [
    { id: 'whole', ticks: WHOLE },
    { id: 'half', ticks: WHOLE / 2 },
    { id: 'quarter', ticks: WHOLE / 4 },
    { id: 'eighth', ticks: WHOLE / 8 },
    { id: 'sixteenth', ticks: WHOLE / 16 },
  ];

  const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const LETTER_SEMITONES = [0, 2, 4, 5, 7, 9, 11];

  const SHARP_ORDER = [3, 0, 4, 1, 5, 2, 6];
  const FLAT_ORDER = [6, 2, 5, 1, 4, 0, 3];

  const FIFTHS_RANGE = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

  function letterOf(d) {
    return ((d % 7) + 7) % 7;
  }

  function octaveOf(d) {
    return Math.floor(d / 7);
  }

  function midiOf(d, alter) {
    return (octaveOf(d) + 1) * 12 + LETTER_SEMITONES[letterOf(d)] + alter;
  }

  function keyAlter(fifths, letter) {
    if (fifths > 0) return SHARP_ORDER.slice(0, fifths).indexOf(letter) !== -1 ? 1 : 0;
    if (fifths < 0) return FLAT_ORDER.slice(0, -fifths).indexOf(letter) !== -1 ? -1 : 0;
    return 0;
  }

  function alterOf(note, fifths) {
    return note.acc === null || note.acc === undefined ? keyAlter(fifths, letterOf(note.d)) : note.acc;
  }

  function midiOfNote(note, fifths) {
    return midiOf(note.d, alterOf(note, fifths));
  }

  function spell(midi, fifths, prefer) {
    const useFlats = prefer === 'flat' || (prefer !== 'sharp' && fifths < 0);
    const pc = ((midi % 12) + 12) % 12;
    const octave = Math.floor(midi / 12) - 1;

    const SHARP_MAP = [
      [0, 0], [0, 1], [1, 0], [1, 1], [2, 0], [3, 0],
      [3, 1], [4, 0], [4, 1], [5, 0], [5, 1], [6, 0],
    ];
    const FLAT_MAP = [
      [0, 0], [1, -1], [1, 0], [2, -1], [2, 0], [3, 0],
      [4, -1], [4, 0], [5, -1], [5, 0], [6, -1], [6, 0],
    ];

    const pair = (useFlats ? FLAT_MAP : SHARP_MAP)[pc];
    const d = octave * 7 + pair[0];
    const alter = pair[1];

    return { d: d, acc: keyAlter(fifths, letterOf(d)) === alter ? null : alter };
  }

  function noteLabel(d, alter, names) {
    const base = names ? names[letterOf(d)] : LETTERS[letterOf(d)];
    const sign = alter > 0 ? '♯' : alter < 0 ? '♭' : '';
    return base + sign + octaveOf(d);
  }

  function ticksOf(event) {
    return event.dot ? (event.base * 3) / 2 : event.base;
  }

  function meterTicks(meter) {
    return (meter.beats * WHOLE) / meter.unit;
  }

  function isRest(event) {
    return !event.notes || event.notes.length === 0;
  }

  function measures(score) {
    const limit = meterTicks(score.meter);
    const out = [];
    let bar = { events: [], ticks: 0, startTick: 0, number: 1 };
    let tick = 0;

    score.events.forEach(function (event, index) {
      const dur = ticksOf(event);
      if (bar.ticks > 0 && bar.ticks + dur > limit) {
        out.push(bar);
        bar = { events: [], ticks: 0, startTick: tick, number: out.length + 1 };
      }
      bar.events.push({ event: event, index: index, startTick: tick, ticks: dur });
      bar.ticks += dur;
      tick += dur;
      if (bar.ticks >= limit) {
        out.push(bar);
        bar = { events: [], ticks: 0, startTick: tick, number: out.length + 1 };
      }
    });

    if (bar.events.length) out.push(bar);
    return out;
  }

  function totalTicks(score) {
    return score.events.reduce(function (sum, event) {
      return sum + ticksOf(event);
    }, 0);
  }

  function tickSeconds(score) {
    return 60 / score.tempo / (WHOLE / 4);
  }

  function empty() {
    return {
      clef: 'treble',
      fifths: 0,
      meter: { beats: 4, unit: 4 },
      tempo: 96,
      events: [],
    };
  }

  function demo() {
    const score = empty();
    const C = 28, D = 29, E = 30, F = 31, G = 32;
    const Q = WHOLE / 4, H = WHOLE / 2, EI = WHOLE / 8;

    const line = [
      [E, Q], [E, Q], [F, Q], [G, Q],
      [G, Q], [F, Q], [E, Q], [D, Q],
      [C, Q], [C, Q], [D, Q], [E, Q],
      [E, Q, true], [D, EI], [D, H],

      [E, Q], [E, Q], [F, Q], [G, Q],
      [G, Q], [F, Q], [E, Q], [D, Q],
      [C, Q], [C, Q], [D, Q], [E, Q],
      [D, Q, true], [C, EI], [C, H],
    ];

    score.events = line.map(function (item) {
      return { notes: [{ d: item[0], acc: null }], base: item[1], dot: Boolean(item[2]) };
    });
    return score;
  }

  function toJSON(score) {
    return {
      format: 'partitura',
      version: 1,
      clef: score.clef,
      fifths: score.fifths,
      meter: { beats: score.meter.beats, unit: score.meter.unit },
      tempo: score.tempo,
      events: score.events.map(function (event) {
        return {
          notes: (event.notes || []).map(function (note) {
            return { d: note.d, acc: note.acc === undefined ? null : note.acc };
          }),
          base: event.base,
          dot: Boolean(event.dot),
        };
      }),
    };
  }

  function fromJSON(raw) {
    if (!raw || raw.format !== 'partitura' || !Array.isArray(raw.events)) return null;

    const bases = DURATIONS.map(function (d) {
      return d.ticks;
    });

    const score = empty();
    score.clef = raw.clef === 'bass' ? 'bass' : 'treble';
    score.fifths = FIFTHS_RANGE.indexOf(raw.fifths) !== -1 ? raw.fifths : 0;
    score.tempo = Math.min(200, Math.max(40, Number(raw.tempo) || 96));

    if (raw.meter && Number(raw.meter.beats) > 0 && Number(raw.meter.unit) > 0) {
      score.meter = { beats: Number(raw.meter.beats), unit: Number(raw.meter.unit) };
    }

    score.events = raw.events
      .map(function (event) {
        if (!event || bases.indexOf(Number(event.base)) === -1) return null;
        const notes = Array.isArray(event.notes)
          ? event.notes
              .filter(function (note) {
                return note && Number.isFinite(Number(note.d));
              })
              .map(function (note) {
                const acc = note.acc;
                return {
                  d: Math.round(Number(note.d)),
                  acc: acc === -1 || acc === 0 || acc === 1 ? acc : null,
                };
              })
          : [];
        return { notes: notes, base: Number(event.base), dot: Boolean(event.dot) };
      })
      .filter(Boolean);

    return score;
  }

  const PPQ = 96;

  function varLen(value) {
    const bytes = [value & 0x7f];
    let rest = value >> 7;
    while (rest > 0) {
      bytes.unshift((rest & 0x7f) | 0x80);
      rest >>= 7;
    }
    return bytes;
  }

  function pushString(out, text) {
    for (let i = 0; i < text.length; i++) out.push(text.charCodeAt(i) & 0xff);
  }

  function pushUint32(out, value) {
    out.push((value >> 24) & 0xff, (value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff);
  }

  function toMidi(score) {
    const track = [];
    const perTick = PPQ / (WHOLE / 4);

    const micros = Math.round(60000000 / score.tempo);
    track.push(0x00, 0xff, 0x51, 0x03, (micros >> 16) & 0xff, (micros >> 8) & 0xff, micros & 0xff);

    const denomPower = Math.round(Math.log(score.meter.unit) / Math.LN2);
    track.push(0x00, 0xff, 0x58, 0x04, score.meter.beats, denomPower, 24, 8);

    track.push(0x00, 0xff, 0x59, 0x02, score.fifths & 0xff, 0x00);

    let pending = 0;
    score.events.forEach(function (event) {
      const length = Math.round(ticksOf(event) * perTick);

      if (isRest(event)) {
        pending += length;
        return;
      }

      const pitches = event.notes.map(function (note) {
        return midiOfNote(note, score.fifths);
      });

      pitches.forEach(function (pitch, i) {
        varLen(i === 0 ? pending : 0).forEach(function (b) {
          track.push(b);
        });
        track.push(0x90, pitch & 0x7f, 0x64);
      });

      const sound = Math.max(1, length - 4);
      pitches.forEach(function (pitch, i) {
        varLen(i === 0 ? sound : 0).forEach(function (b) {
          track.push(b);
        });
        track.push(0x80, pitch & 0x7f, 0x40);
      });

      pending = length - sound;
    });

    track.push(0x00, 0xff, 0x2f, 0x00);

    const out = [];
    pushString(out, 'MThd');
    pushUint32(out, 6);
    out.push(0x00, 0x00, 0x00, 0x00, (PPQ >> 8) & 0xff, PPQ & 0xff);
    pushString(out, 'MTrk');
    pushUint32(out, track.length);

    return new Uint8Array(out.concat(track));
  }

  ns.score = {
    WHOLE: WHOLE,
    DURATIONS: DURATIONS,
    LETTERS: LETTERS,
    FIFTHS_RANGE: FIFTHS_RANGE,
    SHARP_ORDER: SHARP_ORDER,
    FLAT_ORDER: FLAT_ORDER,

    letterOf: letterOf,
    octaveOf: octaveOf,
    midiOf: midiOf,
    keyAlter: keyAlter,
    alterOf: alterOf,
    midiOfNote: midiOfNote,
    spell: spell,
    noteLabel: noteLabel,

    ticksOf: ticksOf,
    meterTicks: meterTicks,
    isRest: isRest,
    measures: measures,
    totalTicks: totalTicks,
    tickSeconds: tickSeconds,

    empty: empty,
    demo: demo,
    toJSON: toJSON,
    fromJSON: fromJSON,
    toMidi: toMidi,
  };
})(window.Partitura);
