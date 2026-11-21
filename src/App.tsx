import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { Layout } from './components/Layout';
import { DrillPage } from './pages/DrillPage';
import { ReversePage } from './pages/ReversePage';
import { SettingsPage } from './pages/SettingsPage';
import { StatsPage } from './pages/StatsPage';
import { TablePage } from './pages/TablePage';
import { StoreProvider } from './state/store';

export function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<DrillPage />} />
            <Route path="tebak" element={<ReversePage />} />
            <Route path="tabel" element={<TablePage />} />
            <Route path="statistik" element={<StatsPage />} />
            <Route path="pengaturan" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
