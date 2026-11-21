import { NavLink, Outlet } from 'react-router';
import { useStore } from '../state/store';

const NAV = [
  { to: '/', label: 'Latihan' },
  { to: '/tebak', label: 'Tebak Bentuk' },
  { to: '/tabel', label: 'Tabel' },
  { to: '/statistik', label: 'Statistik' },
  { to: '/pengaturan', label: 'Pengaturan' },
];

export function Layout() {
  const { day, streak, pool, srs } = useStore();
  const now = Date.now();
  const due = pool.filter((it) => srs[it.key] && srs[it.key].due <= now).length;

  return (
    <div className="wrap">
      <header className="top">
        <div className="brand">
          <span className="seal" aria-hidden="true">活用</span>
          <div>
            <h1>Dojo Konjugasi</h1>
            <p className="sub">Latihan perubahan bentuk kata kerja &amp; kata sifat Jepang · N5–N3</p>
          </div>
        </div>
        <div className="today">
          <span>
            Hari ini <b>{day.c}</b>/<b>{day.n}</b> benar
          </span>
          <span>
            Beruntun <b>{streak}</b>
          </span>
          <span>
            Perlu diulang <b>{due}</b>
          </span>
        </div>
      </header>

      <nav className="tabs" aria-label="Menu">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.to === '/'} className="tab">
            {n.label}
          </NavLink>
        ))}
      </nav>

      <main className="set">
        <Outlet />
      </main>
    </div>
  );
}
