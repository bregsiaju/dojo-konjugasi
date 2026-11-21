import { useMemo, useState } from 'react';
import { Html } from '../components/Html';
import { Ruby } from '../components/Ruby';
import { FORM_BY_ID, FORM_GROUPS, GROUP_NAME } from '../data/forms';
import { WORDS } from '../data/words';
import { applies, conjugate, uniqueSolutions, WORD_BY_ID } from '../lib/conjugate';
import { explain } from '../lib/explain';
import { gloss } from '../lib/gloss';
import { romaToKana } from '../lib/kana';
import type { Word } from '../types';

const FEATURED = ['書く', '食べる', '行く', 'する', '来る', '買う', '帰る', 'いい', '高い', '静か', 'きれい', 'いらっしゃる'];

function search(q: string): Word[] {
  const query = q.trim().toLowerCase();
  if (!query) return FEATURED.map((k) => WORD_BY_ID[k]).filter(Boolean);
  const kana = romaToKana(query, true);
  return WORDS.filter(
    (w) => w.k.includes(query) || w.r.includes(query) || w.r.includes(kana) || w.m.toLowerCase().includes(query),
  ).slice(0, 16);
}

export function TablePage() {
  const [query, setQuery] = useState('');
  const [word, setWord] = useState<Word>(WORD_BY_ID['書く']);
  const results = useMemo(() => search(query), [query]);

  return (
    <article className="card">
      <div className="search">
        <label htmlFor="tbl-q" className="lbl">Cari kata (kanji, kana, romaji, atau arti)</label>
        <input
          id="tbl-q"
          className="field"
          lang="ja"
          placeholder="mis. 書く, taberu, membaca"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="results">
          {results.length ? (
            results.map((w) => (
              <button key={w.k} type="button" className="res" lang="ja" aria-pressed={w.k === word.k} onClick={() => setWord(w)}>
                {w.k}
                {w.k !== w.r && <span style={{ opacity: 0.7 }}> {w.r}</span>}
              </button>
            ))
          ) : (
            <span className="empty">Tidak ditemukan.</span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <span className="big" lang="ja"><Ruby k={word.k} r={word.r} /></span>
        <span style={{ color: 'var(--muted)' }}>{word.m}</span>
        <span className="chip">N{word.lv}</span>
        <span className="chip ghost">{GROUP_NAME[word.t]}</span>
      </div>

      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>Bentuk</th>
              <th>Hasil</th>
              <th>Aturan</th>
            </tr>
          </thead>
          <tbody>
            {FORM_GROUPS.map(([group, ids]) => {
              const rows = ids.filter((id) => applies(word, id));
              if (!rows.length) return null;
              return [
                <tr key={group} className="sec">
                  <td colSpan={3}>{group}</td>
                </tr>,
                ...rows.map((id) => {
                  const [main, ...alts] = uniqueSolutions(conjugate(word, id)!);
                  const ex = explain(word, id);
                  return (
                    <tr key={id}>
                      <td className="f">
                        {FORM_BY_ID[id].name}
                        <span className="p" lang="ja">{FORM_BY_ID[id].jp}</span>
                      </td>
                      <td className="a" lang="ja">
                        <Ruby k={main.k} r={main.r} />
                        <span className="gloss">{gloss(word, id)}</span>
                        {alts.length > 0 && (
                          <span className="alt">juga: {alts.map((x) => (x.k === x.r ? x.k : `${x.k} (${x.r})`)).join(', ')}</span>
                        )}
                      </td>
                      <td className="r">
                        <Html html={ex.rule} />
                        {ex.notes.map((n, i) => (
                          <span key={i}>
                            <br />
                            <Html html={n} />
                          </span>
                        ))}
                      </td>
                    </tr>
                  );
                }),
              ];
            })}
          </tbody>
        </table>
      </div>
    </article>
  );
}
