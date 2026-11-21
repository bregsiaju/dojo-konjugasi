import type { ReactNode, Ref } from 'react';
import type { Explanation } from '../types';
import { Html } from './Html';

export type Verdict = 'ok' | 'ng' | 'skip';

const HEAD: Record<Verdict, [string, string]> = {
  ok: ['正解', 'Benar'],
  ng: ['残念', 'Belum tepat'],
  skip: ['答え', 'Ini jawabannya'],
};

export function FbRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="row">
      <span className="lbl">{label}</span>
      <span>{children}</span>
    </div>
  );
}

interface Props {
  verdict: Verdict;
  /** Baris-baris khusus halaman (jawaban, bentuk kamus, dsb.) */
  children: ReactNode;
  explanation: Explanation;
  hint: string;
  onNext: () => void;
  nextRef?: Ref<HTMLButtonElement>;
}

/** Panel hasil setelah menjawab: judul, baris info, aturan, catatan, tombol lanjut. */
export function Feedback({ verdict, children, explanation, hint, onNext, nextRef }: Props) {
  const [jp, id] = HEAD[verdict];
  return (
    <div className="fb">
      <div className={`fb-head ${verdict === 'ok' ? 'ok' : 'ng'}`}>
        <span className="jp" lang="ja">{jp}</span>
        <span>{id}</span>
      </div>
      {children}
      <FbRow label="Aturan">
        <Html className="rule" html={explanation.rule} />
      </FbRow>
      {explanation.notes.map((n, i) => (
        <FbRow key={i} label="Catatan">
          <Html className="note" html={n} />
        </FbRow>
      ))}
      <div className="actions">
        <button className="btn primary" type="button" ref={nextRef} onClick={onNext}>
          Berikutnya
        </button>
        <span className="hint">{hint}</span>
      </div>
    </div>
  );
}
