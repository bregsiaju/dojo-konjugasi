import { useRef, type Ref } from 'react';
import { romaToKana } from '../lib/kana';

interface Props {
  id: string;
  value: string;
  onValueChange: (v: string) => void;
  /** Ubah romaji jadi kana saat mengetik */
  romaji: boolean;
  readOnly?: boolean;
  className?: string;
  inputRef?: Ref<HTMLInputElement>;
}

/**
 * Input jawaban bergaris kotak (genkō yōshi).
 * Mendukung IME Jepang (konversi dilewati selama komposisi) dan konversi romaji bawaan.
 */
export function KanaInput({ id, value, onValueChange, romaji, readOnly, className, inputRef }: Props) {
  const composing = useRef(false);

  return (
    <input
      id={id}
      ref={inputRef}
      lang="ja"
      inputMode="text"
      autoCapitalize="off"
      autoCorrect="off"
      autoComplete="off"
      spellCheck={false}
      placeholder="かな"
      className={className}
      readOnly={readOnly}
      value={value}
      onCompositionStart={() => {
        composing.current = true;
      }}
      onCompositionEnd={(e) => {
        composing.current = false;
        const v = e.currentTarget.value;
        onValueChange(romaji ? romaToKana(v) : v);
      }}
      onChange={(e) => {
        const el = e.currentTarget;
        const v = el.value;
        const native = e.nativeEvent as InputEvent;
        // Hanya konversi jika kursor di akhir, supaya mengedit di tengah tidak melompat
        if (!romaji || composing.current || native.isComposing || el.selectionStart !== v.length) {
          onValueChange(v);
          return;
        }
        onValueChange(romaToKana(v));
      }}
    />
  );
}
