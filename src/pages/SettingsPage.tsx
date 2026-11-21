import { useState } from 'react';
import { Toggle } from '../components/Toggle';
import { FORM_BY_ID, FORM_GROUPS, FORMS, TYPE_KEYS } from '../data/forms';
import { useStore } from '../state/store';
import type { Level, Settings } from '../types';

const LEVELS: Level[] = [5, 4, 3];
const DISPLAY: [keyof Settings, string][] = [
  ['furigana', 'Tampilkan cara baca (furigana)'],
  ['pattern', 'Tampilkan pola bentuk'],
  ['showGroup', 'Tampilkan golongan kata di soal'],
  ['romaji', 'Ubah romaji jadi kana otomatis'],
];

export function SettingsPage() {
  const { settings: s, updateSettings, pool, resetProgress } = useStore();
  const [confirming, setConfirming] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const words = new Set(pool.map((p) => p.w.k)).size;

  const preset = (minLevel: Level) =>
    updateSettings((prev) => ({
      ...prev,
      forms: Object.fromEntries(FORMS.map((F) => [F.id, F.lv >= minLevel])) as Settings['forms'],
    }));

  return (
    <>
      <article className="card">
        <div className="set-head">
          <h2>Cakupan latihan</h2>
          <span className="count">
            <b>{pool.length.toLocaleString('id-ID')}</b> kombinasi · <b>{words}</b> kata
          </span>
        </div>
        <div className="fgroup">
          <h3>Level JLPT</h3>
          <div className="toggles">
            {LEVELS.map((l) => (
              <Toggle key={l} id={`lv-${l}`} checked={s.levels[l]} onChange={(on) => updateSettings((p) => ({ ...p, levels: { ...p.levels, [l]: on } }))}>
                N{l}
              </Toggle>
            ))}
          </div>
        </div>
        <div className="fgroup">
          <h3>Jenis kata</h3>
          <div className="toggles">
            {TYPE_KEYS.map(([k, label]) => (
              <Toggle key={k} id={`ty-${k}`} checked={s.types[k]} onChange={(on) => updateSettings((p) => ({ ...p, types: { ...p.types, [k]: on } }))}>
                {label}
              </Toggle>
            ))}
          </div>
        </div>
      </article>

      <article className="card">
        <div className="set-head">
          <h2>Bentuk yang dilatih</h2>
          <div className="presets">
            <button className="btn ghost small" type="button" onClick={() => preset(5)}>Dasar N5</button>
            <button className="btn ghost small" type="button" onClick={() => preset(4)}>Sampai N4</button>
            <button className="btn ghost small" type="button" onClick={() => preset(3)}>Semua</button>
          </div>
        </div>
        <div className="set">
          {FORM_GROUPS.map(([group, ids]) => (
            <div className="fgroup" key={group}>
              <h3>{group}</h3>
              <div className="toggles">
                {ids.map((id) => (
                  <Toggle
                    key={id}
                    id={`fm-${id}`}
                    checked={s.forms[id]}
                    small={`N${FORM_BY_ID[id].lv}`}
                    onChange={(on) => updateSettings((p) => ({ ...p, forms: { ...p.forms, [id]: on } }))}
                  >
                    {FORM_BY_ID[id].name}{' '}
                    <span lang="ja" style={{ opacity: 0.75 }}>{FORM_BY_ID[id].jp}</span>
                  </Toggle>
                ))}
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="card">
        <h2>Tampilan</h2>
        <div className="toggles">
          {DISPLAY.map(([key, label]) => (
            <Toggle key={key} id={`op-${key}`} checked={s[key] as boolean} onChange={(on) => updateSettings((p) => ({ ...p, [key]: on }))}>
              {label}
            </Toggle>
          ))}
        </div>
      </article>

      <article className="card">
        <h2>Data</h2>
        <p className="empty" style={{ margin: 0 }}>
          Progres tersimpan di browser ini saja. Membersihkan data situs akan menghapusnya.
        </p>
        {confirming ? (
          <div className="confirm">
            <span>Hapus semua progres dan statistik?</span>
            <button
              className="btn danger small"
              type="button"
              onClick={() => {
                resetProgress();
                setConfirming(false);
                setResetDone(true);
              }}
            >
              Ya, hapus
            </button>
            <button className="btn ghost small" type="button" onClick={() => setConfirming(false)}>Batal</button>
          </div>
        ) : (
          <div className="confirm">
            <button className="btn ghost small" type="button" onClick={() => { setConfirming(true); setResetDone(false); }}>
              Hapus semua progres
            </button>
            {resetDone && <span className="empty">Progres dihapus.</span>}
          </div>
        )}
      </article>
    </>
  );
}
