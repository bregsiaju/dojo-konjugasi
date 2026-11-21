import type { ReactNode } from 'react';
import type { Example } from '../data/examples';
import { parseExample, type Segment } from '../lib/examples';
import { useStore } from '../state/store';

/** Contoh kalimat dengan furigana (mengikuti pengaturan), bagian konjugasi disorot, dan terjemahannya. */
export function ExampleSentence({ example, compact }: { example: Example; compact?: boolean }) {
  const { settings } = useStore();
  const segs = parseExample(example.ja);

  const renderSeg = (s: Segment, i: number) =>
    s.ruby && settings.furigana ? (
      <ruby key={i}>
        {s.text}
        <rt>{s.ruby}</rt>
      </ruby>
    ) : (
      <span key={i}>{s.text}</span>
    );

  // Gabungkan potongan yang berurutan dengan status sorot yang sama ke dalam satu <mark>
  const groups: ReactNode[] = [];
  for (let i = 0; i < segs.length; ) {
    const hl = segs[i].hl;
    const start = i;
    while (i < segs.length && segs[i].hl === hl) i++;
    const parts = segs.slice(start, i).map((s, j) => renderSeg(s, start + j));
    groups.push(hl ? <mark key={start}>{parts}</mark> : parts);
  }

  return (
    <span className={`ex${compact ? ' compact' : ''}`}>
      <span className="ex-ja" lang="ja">{groups}</span>
      <span className="ex-id">{example.id}</span>
    </span>
  );
}
