export function Botanical({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 280"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M70 280C130 199 77 126 143 19M86 241C50 202 31 187 21 157M104 186C145 160 166 124 180 88"
        stroke="#7e8b63"
        strokeWidth="2"
      />
      {[
        [132, 40, -25],
        [112, 88, 20],
        [104, 137, -35],
        [98, 195, 20],
        [66, 217, -50],
        [41, 184, -45],
        [144, 148, 30],
        [169, 111, 30],
      ].map(([x, y, r], i) => (
        <ellipse
          key={i}
          cx={x}
          cy={y}
          rx={15}
          ry={31}
          transform={"rotate(" + r + " " + x + " " + y + ")"}
          fill={i % 2 ? "#a9b295" : "#6c876f"}
          opacity={0.75}
        />
      ))}
    </svg>
  );
}
export function StillLife({ kind = "care" }: { kind?: string }) {
  return (
    <svg
      viewBox="0 0 260 170"
      role="img"
      aria-label={
        kind === "guide"
          ? "An illustrated open journal and a sprig of leaves"
          : "A warm illustration of everyday care essentials"
      }
    >
      <ellipse cx="134" cy="147" rx="99" ry="12" fill="#d9d4bd" opacity=".5" />
      <path
        d="M208 145V67M207 104c-25-3-32-25-21-32 20 5 24 19 21 32Zm1-14c23-8 24-30 15-33-18 7-22 23-15 33Z"
        stroke="#6a8066"
        fill="#92a080"
        strokeWidth="2"
      />
      <path d="M188 119h39l-6 28h-28Z" fill="#d8bca1" />
      {kind === "guide" ? (
        <>
          <path
            d="M47 73q42-15 81 0v72q-40-18-81 0ZM128 73q40-15 80 0v72q-40-18-80 0Z"
            fill="#fdf9ec"
            stroke="#d5c6ae"
          />
          <path
            d="M60 88h53M60 101h44M60 114h47M142 88h52M142 101h42M142 114h47"
            stroke="#a3ab90"
            strokeWidth="3"
          />
          <path d="M119 73v63l9-7 8 7V73" fill="#b98369" />
        </>
      ) : (
        <>
          <rect x="48" y="111" width="110" height="32" rx="8" fill="#e4bb9f" />
          <rect x="55" y="96" width="107" height="26" rx="8" fill="#f5ecdb" />
          <path d="M65 110h79M60 132h82" stroke="#c9a188" />
          <rect x="140" y="63" width="35" height="74" rx="12" fill="#a8b9a0" />
          <rect x="149" y="53" width="17" height="13" rx="4" fill="#6f8871" />
          <rect x="146" y="88" width="23" height="27" rx="5" fill="#f6f0db" />
          <path d="M157 94c-10 12-7 16 0 16s10-4 0-16Z" fill="#dcb697" />
          <circle cx="93" cy="61" r="26" fill="#dfcfae" />
          <circle cx="93" cy="61" r="13" fill="#f8f0df" />
        </>
      )}
    </svg>
  );
}
