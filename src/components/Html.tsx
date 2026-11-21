/**
 * Menampilkan teks aturan yang berisi tag <b>.
 * Hanya untuk string dari lib/explain.ts (data milik aplikasi sendiri, bukan input pengguna).
 */
export function Html({ html, className }: { html: string; className?: string }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
