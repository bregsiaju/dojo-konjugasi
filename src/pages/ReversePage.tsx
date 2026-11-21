import { useCallback, useEffect, useRef, useState } from 'react';
import { Feedback, FbRow } from '../components/Feedback';
import { Ruby } from '../components/Ruby';
import { FORM_BY_ID, FORMS, formLabel } from '../data/forms';
import { applies, conjugate } from '../lib/conjugate';
import { explain } from '../lib/explain';
import type { PoolItem } from '../lib/srs';
import { pickRandom, shuffle } from '../lib/util';
import { useStore } from '../state/store';
import type { FormId, Settings, Solution } from '../types';

interface Question extends PoolItem {
  surface: Solution;
  /** Semua bentuk yang menghasilkan tulisan yang sama (mis. potensial = pasif untuk ichidan) */
  same: FormId[];
  options: FormId[];
}

function makeQuestion(pool: PoolItem[], settings: Settings): Question | null {
  if (!pool.length) return null;
  const it = pickRandom(pool);
  const surface = conjugate(it.w, it.f)![0];
  const same = FORMS.filter((F) => conjugate(it.w, F.id)?.some((x) => x.r === surface.r)).map((F) => F.id);
  const distractors = shuffle(
    FORMS.filter((F) => F.t === FORM_BY_ID[it.f].t && applies(it.w, F.id) && !same.includes(F.id)),
  ).sort((a, b) => Number(settings.forms[b.id]) - Number(settings.forms[a.id]));
  return { ...it, surface, same, options: shuffle([it.f, ...distractors.slice(0, 3).map((F) => F.id)]) };
}

export function ReversePage() {
  const { pool, settings, recordReverse } = useStore();
  const [q, setQ] = useState(() => makeQuestion(pool, settings));
  const [chosen, setChosen] = useState<FormId | null>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const next = useCallback(() => {
    setQ(makeQuestion(pool, settings));
    setChosen(null);
  }, [pool, settings]);

  const answer = useCallback(
    (f: FormId) => {
      if (!q || chosen) return;
      setChosen(f);
      recordReverse(q.same.includes(f));
    },
    [q, chosen, recordReverse],
  );

  // Pilih cepat dengan tombol 1–4
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || !q || chosen) return;
      const n = Number(e.key);
      if (n >= 1 && n <= q.options.length) answer(q.options[n - 1]);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [q, chosen, answer]);

  useEffect(() => {
    if (chosen) nextRef.current?.focus({ preventScroll: true });
  }, [chosen]);

  if (!q) {
    return (
      <article className="card">
        <p className="empty">Tidak ada soal yang cocok. Ubah cakupan di Pengaturan.</p>
      </article>
    );
  }

  const ok = chosen ? q.same.includes(chosen) : false;
  const shown = chosen && ok ? chosen : q.f;

  return (
    <article className="card">
      <div className="q-meta">
        <span className="chip">N{q.w.lv}</span>
        <span className="chip ghost">Bentuk apa ini?</span>
      </div>
      <div className="q-word" lang="ja">
        <Ruby k={q.surface.k} r={q.surface.r} />
      </div>
      <div className="q-desc" style={{ marginTop: -6 }}>
        Pilih nama bentuknya. Tekan 1–4 di keyboard untuk memilih cepat.
      </div>

      <div className="opts">
        {q.options.map((id, i) => {
          const cls = chosen ? (q.same.includes(id) ? 'right' : id === chosen ? 'wrong' : '') : '';
          return (
            <button key={id} type="button" className={`opt ${cls}`} disabled={!!chosen} onClick={() => answer(id)}>
              <span className="k">{i + 1}</span>
              <span className="n">{formLabel(id)}</span>
              <span className="p" lang="ja">{FORM_BY_ID[id].jp}</span>
            </button>
          );
        })}
      </div>

      {chosen && (
        <Feedback verdict={ok ? 'ok' : 'ng'} explanation={explain(q.w, shown)} onNext={next} nextRef={nextRef} hint="Enter untuk lanjut">
          <FbRow label="Bentuk kamus">
            <span className="big" lang="ja"><Ruby k={q.w.k} r={q.w.r} /></span>{' '}
            <span style={{ color: 'var(--muted)' }}>{q.w.m}</span>
          </FbRow>
          <FbRow label="Bentuk">
            {FORM_BY_ID[shown].name} <span className="pat" lang="ja">{FORM_BY_ID[shown].jp}</span>
          </FbRow>
          {q.same.length > 1 && (
            <FbRow label="Bisa juga">
              {q.same.filter((x) => x !== shown).map((x) => FORM_BY_ID[x].name).join(', ')}. Konteks kalimat yang menentukan.
            </FbRow>
          )}
        </Feedback>
      )}
    </article>
  );
}
