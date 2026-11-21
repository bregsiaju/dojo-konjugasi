import { useNavigate } from 'react-router';
import { Ruby } from '../components/Ruby';
import { FORM_BY_ID, FORM_GROUPS } from '../data/forms';
import { accuracy, MASTERED_BOX, parseKey } from '../lib/srs';
import { pct } from '../lib/util';
import { useStore } from '../state/store';
import type { FormId } from '../types';
import type { DrillLocationState } from './DrillPage';

export function StatsPage() {
  const { srs, revs } = useStore();
  const navigate = useNavigate();

  let correct = 0, wrong = 0, mastered = 0;
  const byForm: Partial<Record<FormId, { c: number; w: number }>> = {};
  for (const [key, e] of Object.entries(srs)) {
    correct += e.c;
    wrong += e.w;
    if (e.b >= MASTERED_BOX) mastered++;
    const f = key.slice(key.lastIndexOf('|') + 1) as FormId;
    const s = (byForm[f] ??= { c: 0, w: 0 });
    s.c += e.c;
    s.w += e.w;
  }
  const total = correct + wrong;

  const weakest = Object.entries(srs)
    .filter(([, e]) => e.w > 0)
    .map(([key, e]) => ({ item: parseKey(key), e }))
    .filter((x) => x.item)
    .sort((a, b) => accuracy(a.e) - accuracy(b.e) || b.e.w - a.e.w)
    .slice(0, 10);

  const tiles: [string, string][] = [
    [total.toLocaleString('id-ID'), 'jawaban latihan'],
    [total ? pct(correct, total) + '%' : '—', 'akurasi'],
    [mastered.toLocaleString('id-ID'), 'kombinasi dikuasai'],
    [revs.n ? pct(revs.c, revs.n) + '%' : '—', `tebak bentuk (${revs.n})`],
  ];

  return (
    <>
      <div className="tiles">
        {tiles.map(([v, l]) => (
          <div className="tile" key={l}>
            <div className="v">{v}</div>
            <div className="l">{l}</div>
          </div>
        ))}
      </div>

      <article className="card">
        <h2>Akurasi per bentuk</h2>
        <div className="set">
          {FORM_GROUPS.map(([group, ids]) => (
            <div className="fgroup" key={group}>
              <h3>{group}</h3>
              <div className="heat">
                {ids.map((id) => {
                  const s = byForm[id];
                  const n = s ? s.c + s.w : 0;
                  const a = n ? s!.c / n : 0;
                  const col = `color-mix(in oklab, var(--good) ${Math.round(a * 100)}%, var(--shu))`;
                  return (
                    <div className="hc" key={id} style={n ? { background: `color-mix(in oklab, ${col} 12%, var(--card))` } : undefined}>
                      <span className="n">{FORM_BY_ID[id].name}</span>
                      <span className="p" lang="ja">{FORM_BY_ID[id].jp}</span>
                      <div className="meter">
                        <i style={{ width: `${n ? Math.round(a * 100) : 0}%`, background: col }} />
                      </div>
                      <span className="s">{n ? `${Math.round(a * 100)}% · ${n} jawaban` : 'belum dilatih'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="card">
        <h2>Paling sering salah</h2>
        <div className="weak">
          {weakest.length ? (
            weakest.map(({ item, e }) => (
              <div className="wk" key={item!.key}>
                <span className="w" lang="ja">
                  <Ruby k={item!.w.k} r={item!.w.r} />
                  <small>→ {FORM_BY_ID[item!.f].name}</small>
                </span>
                <span className="s">
                  {e.c} benar · {e.w} salah
                </span>
                <button
                  className="btn ghost small"
                  type="button"
                  onClick={() => navigate('/', { state: { key: item!.key } satisfies DrillLocationState })}
                >
                  Latih
                </button>
              </div>
            ))
          ) : (
            <p className="empty">Belum ada data. Jawaban yang salah di tab Latihan akan muncul di sini.</p>
          )}
        </div>
      </article>
    </>
  );
}
