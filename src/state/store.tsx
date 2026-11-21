import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { buildPool, gradeEntry, type PoolItem, type SrsEntry, type SrsMap } from '../lib/srs';
import { todayStr } from '../lib/util';
import type { Settings } from '../types';
import { load, save, type DayStats, type ReverseStats } from './storage';

interface Store {
  settings: Settings;
  updateSettings: (fn: (s: Settings) => Settings) => void;
  srs: SrsMap;
  day: DayStats;
  revs: ReverseStats;
  streak: number;
  /** Kombinasi kata × bentuk yang aktif menurut pengaturan */
  pool: PoolItem[];
  /** Catat jawaban latihan; mengembalikan jadwal baru untuk kombinasi itu */
  recordDrill: (key: string, ok: boolean) => SrsEntry;
  recordReverse: (ok: boolean) => void;
  resetProgress: () => void;
}

const StoreContext = createContext<Store | null>(null);

function bumpDay(day: DayStats, ok: boolean): DayStats {
  const d = day.d === todayStr() ? day : { d: todayStr(), c: 0, n: 0 };
  return { d: d.d, c: d.c + (ok ? 1 : 0), n: d.n + 1 };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(load);
  const [settings, setSettings] = useState(initial.settings);
  const [srs, setSrs] = useState(initial.srs);
  const [day, setDay] = useState(() => (initial.day.d === todayStr() ? initial.day : { d: todayStr(), c: 0, n: 0 }));
  const [revs, setRevs] = useState(initial.revs);
  const [streak, setStreak] = useState(0);

  useEffect(() => save({ settings, srs, day, revs }), [settings, srs, day, revs]);

  const pool = useMemo(() => buildPool(settings), [settings]);

  const recordDrill = useCallback(
    (key: string, ok: boolean) => {
      const entry = gradeEntry(srs[key], ok);
      setSrs((prev) => ({ ...prev, [key]: entry }));
      setDay((d) => bumpDay(d, ok));
      setStreak((s) => (ok ? s + 1 : 0));
      return entry;
    },
    [srs],
  );

  const recordReverse = useCallback((ok: boolean) => {
    setRevs((r) => ({ c: r.c + (ok ? 1 : 0), n: r.n + 1 }));
    setDay((d) => bumpDay(d, ok));
    setStreak((s) => (ok ? s + 1 : 0));
  }, []);

  const resetProgress = useCallback(() => {
    setSrs({});
    setRevs({ c: 0, n: 0 });
    setDay({ d: todayStr(), c: 0, n: 0 });
    setStreak(0);
  }, []);

  const value: Store = {
    settings,
    updateSettings: setSettings,
    srs,
    day,
    revs,
    streak,
    pool,
    recordDrill,
    recordReverse,
    resetProgress,
  };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore harus dipakai di dalam <StoreProvider>');
  return ctx;
}

