// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { App } from './App';

function renderAt(path: string) {
  window.history.pushState({}, '', path);
  return render(<App />);
}

beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe('halaman', () => {
  it('Latihan: menjawab "Tidak tahu" lalu lanjut ke soal berikutnya', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { name: 'Dojo Konjugasi' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Tidak tahu' }));
    expect(screen.getByText('Ini jawabannya')).toBeTruthy();
    expect(screen.getByText(/Hari ini/).textContent).toContain('0/1');
    fireEvent.click(screen.getByRole('button', { name: 'Berikutnya' }));
    expect(screen.getByRole('button', { name: 'Periksa' })).toBeTruthy();
  });

  it('Latihan: romaji diubah menjadi kana', () => {
    renderAt('/');
    const input = screen.getByLabelText('Jawaban dalam kana') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'kaita', selectionStart: 5 } });
    expect(input.value).toBe('かいた');
  });

  it('Tebak Bentuk: memilih jawaban menampilkan hasil', () => {
    renderAt('/tebak');
    const options = screen.getAllByRole('button').filter((b) => b.classList.contains('opt'));
    expect(options.length).toBeGreaterThanOrEqual(2);
    fireEvent.click(options[0]);
    expect(screen.getByRole('button', { name: 'Berikutnya' })).toBeTruthy();
  });

  it('Tabel: menampilkan konjugasi 書く dan bisa mencari kata', () => {
    renderAt('/tabel');
    expect(screen.getAllByText('書かない').length).toBeGreaterThan(0);
    fireEvent.change(screen.getByLabelText(/Cari kata/), { target: { value: 'taberu' } });
    fireEvent.click(screen.getByRole('button', { name: /食べる/ }));
    expect(screen.getAllByText('食べさせられる').length).toBeGreaterThan(0);
  });

  it('Statistik dan Pengaturan bisa dibuka', () => {
    renderAt('/statistik');
    expect(screen.getByText('Akurasi per bentuk')).toBeTruthy();
    cleanup();
    renderAt('/pengaturan');
    expect(screen.getByText('Cakupan latihan')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Dasar N5' }));
    expect((screen.getByLabelText(/Potensial/) as HTMLInputElement).checked).toBe(false);
  });
});
