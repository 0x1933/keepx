export function Brand() {
  return (
    <span className="brand">
      <span className="brand-mark" aria-hidden="true">
        <svg className="brand-glyph" viewBox="0 0 32 32" fill="none">
          <path
            d="M9 7.5V24.5"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M9 16L22.5 7.5"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M14.2 13.4L22.5 24.5"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span>Keepx</span>
    </span>
  );
}
