/** Tanda koreksi tinta merah: lingkaran (benar) atau silang (salah). */
export function Mark({ type }: { type: 'ok' | 'ng' }) {
  return (
    <svg className="mark" viewBox="0 0 300 90" preserveAspectRatio="none" aria-hidden="true">
      {type === 'ok' ? (
        <path pathLength={1} d="M60 22 C 120 4, 250 6, 284 34 C 304 54, 252 84, 156 86 C 70 88, 10 72, 16 46 C 22 24, 70 10, 140 8" />
      ) : (
        <>
          <path pathLength={1} d="M40 14 L 130 80" />
          <path pathLength={1} d="M132 12 L 36 82" />
        </>
      )}
    </svg>
  );
}
