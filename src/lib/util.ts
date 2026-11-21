export function pickRandom<T>(arr: T[], rnd = Math.random): T {
  return arr[Math.floor(rnd() * arr.length)];
}

export function shuffle<T>(arr: T[], rnd = Math.random): T[] {
  const b = arr.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/** Tanggal lokal hari ini, format YYYY-MM-DD */
export function todayStr(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);
