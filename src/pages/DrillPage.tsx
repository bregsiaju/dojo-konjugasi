import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Feedback, FbRow, type Verdict } from '../components/Feedback';
import { KanaInput } from '../components/KanaInput';
import { Mark } from '../components/Mark';
import { Ruby } from '../components/Ruby';
import { FORM_BY_ID, formLabel, GROUP_NAME } from '../data/forms';
import { conjugate, uniqueSolutions } from '../lib/conjugate';
import { ExampleSentence } from '../components/ExampleSentence';
import { exampleFor } from '../lib/examples';
import { explain } from '../lib/explain';
import { gloss } from '../lib/gloss';
import { hasLatin, normalizeAnswer, romaToKana } from '../lib/kana';
import { formatInterval, INTERVALS, parseKey, pickItem, type PickedItem, type SrsEntry } from '../lib/srs';
import { useStore } from '../state/store';

/** Bisa dikirim lewat navigate('/', { state }) untuk langsung melatih satu kombinasi */
export interface DrillLocationState {
  key?: string;
}

interface Result {
  verdict: Verdict;
  entry: SrsEntry;
  typed: string;
}

export function DrillPage() {
  const { settings, updateSettings, pool, srs, recordDrill } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const recent = useRef<string[]>([]);

  const [item, setItem] = useState<PickedItem | null>(() => {
    const forced = (location.state as DrillLocationState | null)?.key;
    const it = forced ? parseKey(forced) : null;
    return it ? { ...it, status: 'Lemah' } : pickItem(pool, srs, [], settings.weak);
  });
  const [value, setValue] = useState('');
  const [msg, setMsg] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  // Bersihkan state navigasi supaya refresh tidak mengulang soal yang sama
  useEffect(() => {
    if (location.state) navigate('.', { replace: true, state: null });
  }, [location.state, navigate]);

  const next = useCallback(() => {
    setItem(pickItem(pool, srs, recent.current, settings.weak));
    setValue('');
    setMsg('');
    setResult(null);
  }, [pool, srs, settings.weak]);

  // Ganti soal jika pengaturan berubah dan soal sekarang tidak lagi termasuk
  const prevPool = useRef(pool);
  useEffect(() => {
    if (prevPool.current === pool) return;
    prevPool.current = pool;
    if (!result && (!item || !pool.some((p) => p.key === item.key))) next();
  }, [pool, item, result, next]);

  // Fokus: input saat bertanya, tombol "Berikutnya" setelah menjawab
  useEffect(() => {
    (result ? nextRef.current : inputRef.current)?.focus({ preventScroll: true });
  }, [result, item]);

  function check(skip: boolean) {
    if (!item || result) return;
    const typed = settings.romaji ? romaToKana(value, true) : value;
    setValue(typed);
    const raw = normalizeAnswer(typed);
    if (!skip) {
      if (!raw) return setMsg('Ketik jawabanmu dulu, atau pilih "Tidak tahu".');
      if (hasLatin(raw)) {
        return setMsg(
          settings.romaji
            ? 'Masih ada huruf latin yang belum jadi kana. Periksa ejaannya.'
            : 'Jawaban harus dalam kana. Nyalakan konversi romaji di Pengaturan jika belum punya keyboard Jepang.',
        );
      }
    }
    setMsg('');
    const sols = conjugate(item.w, item.f)!;
    const accepted = new Set(sols.flatMap((s) => [normalizeAnswer(s.k), normalizeAnswer(s.r)]));
    const ok = !skip && accepted.has(raw);
    const entry = recordDrill(item.key, ok);
    recent.current = [...recent.current, item.key].slice(-8);
    setResult({ verdict: ok ? 'ok' : skip ? 'skip' : 'ng', entry, typed: raw });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (result) next();
    else check(false);
  }

  if (!item) {
    return (
      <article className="card">
        <div className="q-word">空</div>
        <p className="q-mean">Tidak ada soal yang cocok dengan pengaturan sekarang.</p>
        <p style={{ margin: 0 }}>Buka Pengaturan, lalu pilih level, jenis kata, dan bentuk yang ingin dilatih.</p>
      </article>
    );
  }

  const F = FORM_BY_ID[item.f];
  const sols = uniqueSolutions(conjugate(item.w, item.f)!);
  const [main, ...alts] = sols;
  const meaning = gloss(item.w, item.f);

  return (
    <>
      <article className="card">
        <div className="q-meta">
          <span className="chip">N{item.w.lv}</span>
          {settings.showGroup && <span className="chip ghost">{GROUP_NAME[item.w.t]}</span>}
          {item.status && <span className={`chip ${item.status === 'Lemah' ? 'warn' : 'ghost'}`}>{item.status}</span>}
        </div>
        <div className="q-word" lang="ja">
          <Ruby k={item.w.k} r={item.w.r} />
        </div>
        <div className="q-mean">{item.w.m}</div>
        <div className="q-target">
          <span className="arrow" aria-hidden="true">→</span>
          <span>{formLabel(item.f)}</span>
          {settings.pattern && <span className="pat" lang="ja">{F.jp}</span>}
        </div>
        <div className="q-gloss">
          Artinya: <b>{meaning}</b>
        </div>
        <div className="q-desc">{F.desc}</div>

        <form onSubmit={onSubmit} autoComplete="off">
          <label htmlFor="ans" className="sr">Jawaban dalam kana</label>
          <div className="ans-wrap">
            <KanaInput
              id="ans"
              inputRef={inputRef}
              value={value}
              onValueChange={(v) => {
                setValue(v);
                setMsg('');
              }}
              romaji={settings.romaji}
              readOnly={!!result}
              className={result?.verdict === 'ok' ? 'ok' : result?.verdict === 'ng' ? 'ng' : ''}
            />
            {result && result.verdict !== 'skip' && <Mark key={item.key} type={result.verdict} />}
          </div>
          <div className="msg" role="status">{msg}</div>
          {!result && (
            <div className="actions">
              <button className="btn primary" type="submit">Periksa</button>
              <button className="btn ghost" type="button" onClick={() => check(true)}>Tidak tahu</button>
              {settings.romaji && <span className="hint">Ketik romaji, otomatis jadi kana (nnn → ん di depan vokal)</span>}
            </div>
          )}
        </form>

        {result && (
          <Feedback
            verdict={result.verdict}
            explanation={explain(item.w, item.f)}
            onNext={next}
            nextRef={nextRef}
            hint={`Enter untuk lanjut · ${result.verdict === 'ok' ? 'muncul lagi ' + formatInterval(INTERVALS[result.entry.b]) : 'akan muncul lagi sebentar'}`}
          >
            <FbRow label="Jawaban">
              <span className="big" lang="ja"><Ruby k={main.k} r={main.r} /></span>
            </FbRow>
            <FbRow label="Arti">{meaning}</FbRow>
            <FbRow label="Contoh">
              <ExampleSentence example={exampleFor(item.w, item.f)} />
            </FbRow>
            {alts.length > 0 && (
              <FbRow label="Juga benar">
                <span className="alts" lang="ja">
                  {alts.map((a) => <Ruby key={a.r} k={a.k} r={a.r} />)}
                </span>
              </FbRow>
            )}
            <FbRow label="Jenis kata">{GROUP_NAME[item.w.t]}</FbRow>
          </Feedback>
        )}
      </article>

      <div className="under">
        <span>
          {pool.length.toLocaleString('id-ID')} kombinasi aktif dari {new Set(pool.map((p) => p.w.k)).size} kata
        </span>
        <label htmlFor="weak-toggle">
          <input
            type="checkbox"
            id="weak-toggle"
            checked={settings.weak}
            onChange={(e) => updateSettings((s) => ({ ...s, weak: e.target.checked }))}
          />{' '}
          Fokus ke yang sering salah
        </label>
      </div>
    </>
  );
}
