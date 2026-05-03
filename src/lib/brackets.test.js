import { describe, expect, it } from 'vitest';
import {
  buildRoundRobin,
  buildSingleElimination,
  nextPow2,
  normalizeBracket,
} from './brackets/index.js';

describe('nextPow2', () => {
  it('returns next power of 2', () => {
    expect(nextPow2(1)).toBe(1);
    expect(nextPow2(3)).toBe(4);
    expect(nextPow2(8)).toBe(8);
    expect(nextPow2(9)).toBe(16);
  });
});

describe('buildSingleElimination', () => {
  it('creates log2(n) rounds for power-of-2 count', () => {
    const p = [
      { id: 'a', name: 'A' },
      { id: 'b', name: 'B' },
      { id: 'c', name: 'C' },
      { id: 'd', name: 'D' },
    ];
    const s = buildSingleElimination(p);
    expect(s.rounds.length).toBe(2);
    expect(s.rounds[0].length).toBe(2);
    expect(s.rounds[1].length).toBe(1);
  });

  it('pads with byes and auto-advances', () => {
    const p = [
      { id: 'a', name: 'A' },
      { id: 'b', name: 'B' },
      { id: 'c', name: 'C' },
    ];
    const s = buildSingleElimination(p);
    expect(s.rounds[0].some((m) => m.winnerId)).toBe(true);
  });
});

describe('buildRoundRobin', () => {
  it('schedules n*(n-1)/2 matches for even n', () => {
    const p = [
      { id: 'a', name: 'A' },
      { id: 'b', name: 'B' },
      { id: 'c', name: 'C' },
      { id: 'd', name: 'D' },
    ];
    const r = buildRoundRobin(p);
    expect(r.matches.length).toBe(6);
  });
});

describe('normalizeBracket', () => {
  it('rebuilds idMap from matches', () => {
    const s = buildSingleElimination([
      { id: 'a', name: 'A' },
      { id: 'b', name: 'B' },
    ]);
    const json = JSON.parse(JSON.stringify(s));
    delete json.idMap;
    const n = normalizeBracket(json);
    expect(Object.keys(n.idMap).length).toBe(s.matches.length);
    for (const m of s.matches) {
      expect(n.idMap[m.id]).toBeDefined();
    }
  });
});
