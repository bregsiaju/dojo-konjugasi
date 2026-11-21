import { describe, expect, it } from 'vitest';
import { defaultSettings } from '../state/storage';
import { buildPool, gradeEntry, INTERVALS, pickItem, RETRY_MS, type SrsMap } from './srs';

describe('gradeEntry', () => {
  it('naik kotak saat benar, kembali ke kotak 1 saat salah', () => {
    const now = 1_000_000;
    const a = gradeEntry(undefined, true, now);
    expect(a).toEqual({ b: 1, c: 1, w: 0, due: now + INTERVALS[1] });
    const b = gradeEntry(a, true, now);
    expect(b.b).toBe(2);
    const c = gradeEntry(b, false, now);
    expect(c).toMatchObject({ b: 1, c: 2, w: 1, due: now + RETRY_MS });
  });
});

describe('pickItem', () => {
  const pool = buildPool(defaultSettings()).slice(0, 20);

  it('mengembalikan null untuk pool kosong', () => {
    expect(pickItem([], {}, [], false)).toBeNull();
  });

  it('memilih soal baru jika belum ada riwayat', () => {
    expect(pickItem(pool, {}, [], false)?.status).toBe('Baru');
  });

  it('memprioritaskan soal jatuh tempo', () => {
    const srs: SrsMap = { [pool[3].key]: { b: 1, c: 0, w: 1, due: 0 } };
    const it = pickItem(pool, srs, [], false, 10, () => 0);
    expect(it?.key).toBe(pool[3].key);
    expect(it?.status).toBe('Ulangan');
  });

  it('mode lemah memilih yang pernah salah', () => {
    const srs: SrsMap = { [pool[5].key]: { b: 1, c: 1, w: 3, due: Infinity } };
    expect(pickItem(pool, srs, [], true)?.key).toBe(pool[5].key);
  });

  it('menghindari soal yang baru muncul', () => {
    const recent = pool.slice(0, 19).map((p) => p.key);
    expect(pickItem(pool, {}, recent, false)?.key).toBe(pool[19].key);
  });
});

describe('buildPool', () => {
  it('mengikuti filter level dan bentuk', () => {
    const s = defaultSettings();
    s.levels[4] = false;
    s.levels[3] = false;
    for (const id of Object.keys(s.forms) as (keyof typeof s.forms)[]) s.forms[id] = id === 'te';
    const pool = buildPool(s);
    expect(pool.length).toBeGreaterThan(50);
    expect(pool.every((p) => p.w.lv === 5 && p.f === 'te')).toBe(true);
  });
});
