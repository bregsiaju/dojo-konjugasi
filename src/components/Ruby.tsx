import { useStore } from '../state/store';

/** Kata dengan furigana di atasnya (jika diaktifkan dan tulisannya berbeda dari cara baca). */
export function Ruby({ k, r }: { k: string; r: string }) {
  const { settings } = useStore();
  if (!settings.furigana || k === r) return <>{k}</>;
  return (
    <ruby>
      {k}
      <rt>{r}</rt>
    </ruby>
  );
}
