// The app's entire icon set: four hand-drawn 16px strokes.
type Props = { className?: string };

const svg = (path: string) => ({ className }: Props) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d={path} />
  </svg>
);

export const SearchIcon = svg('M7 12.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11ZM11 11l3.5 3.5');
export const CloseIcon = svg('M3.5 3.5l9 9M12.5 3.5l-9 9');
export const ChevronIcon = svg('M4 6l4 4 4-4');
export const CheckIcon = svg('M3 8.5l3.2 3L13 4.5');
