import type { ReactNode } from 'react';

interface Props {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  /** Label kecil di kanan, mis. level "N5" */
  small?: string;
}

/** Checkbox berbentuk pil. */
export function Toggle({ id, checked, onChange, children, small }: Props) {
  return (
    <label className="tg" htmlFor={id}>
      <input type="checkbox" id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>
        {children}
        {small && <small>{small}</small>}
      </span>
    </label>
  );
}
