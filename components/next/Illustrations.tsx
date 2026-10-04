/*
 * Simple-shape illustrations for the "coming next" tiles (no clip-art).
 * Each piece floats on its own rhythm; `.float-slow` is off with reduced motion.
 */

const float = (delay: string) => ({ animationDelay: delay });

/** A gift box with a bow, a flower and floating dots. */
export function GiftShapes() {
  return (
    <svg viewBox="0 0 220 200" className="h-auto w-full" aria-hidden="true">
      <g className="float-slow" style={float("0s")}>
        <rect x="52" y="84" width="104" height="86" rx="12" fill="#fff" fillOpacity="0.85" />
        <rect x="44" y="66" width="120" height="30" rx="10" fill="#fff" />
        <rect x="96" y="66" width="16" height="104" fill="var(--orange)" fillOpacity="0.85" />
        <circle cx="90" cy="58" r="15" fill="none" stroke="var(--orange)" strokeWidth="7" />
        <circle cx="118" cy="58" r="15" fill="none" stroke="var(--orange)" strokeWidth="7" />
        <circle cx="104" cy="64" r="6" fill="var(--orange-dark)" />
      </g>
      <g className="float-slow" style={float("-2s")}>
        <circle cx="182" cy="62" r="13" fill="#fff" fillOpacity="0.9" />
        <circle cx="182" cy="62" r="5.5" fill="var(--mustard)" />
        <rect
          x="180.5"
          y="75"
          width="3"
          height="34"
          rx="1.5"
          fill="var(--text)"
          fillOpacity="0.3"
        />
      </g>
      <circle
        className="float-slow"
        style={float("-4s")}
        cx="28"
        cy="46"
        r="7"
        fill="#fff"
        fillOpacity="0.8"
      />
      <circle
        className="float-slow"
        style={float("-1s")}
        cx="196"
        cy="150"
        r="5"
        fill="var(--orange)"
        fillOpacity="0.6"
      />
    </svg>
  );
}

/** A calendar card with one marked date — the brand's orange dot. */
export function CalendarShapes() {
  const days = Array.from({ length: 15 }, (_, i) => i);
  return (
    <svg viewBox="0 0 220 200" className="h-auto w-full" aria-hidden="true">
      <g className="float-slow" style={float("-1.5s")}>
        <rect x="40" y="46" width="138" height="128" rx="16" fill="#fff" fillOpacity="0.9" />
        <rect x="40" y="46" width="138" height="32" rx="16" fill="var(--text)" fillOpacity="0.85" />
        <rect x="40" y="62" width="138" height="16" fill="var(--text)" fillOpacity="0.85" />
        <rect x="68" y="34" width="8" height="24" rx="4" fill="var(--text)" fillOpacity="0.85" />
        <rect x="142" y="34" width="8" height="24" rx="4" fill="var(--text)" fillOpacity="0.85" />
        {days.map((d) => (
          <circle
            key={d}
            cx={62 + (d % 5) * 23.5}
            cy={98 + Math.floor(d / 5) * 25}
            r={d === 8 ? 9 : 4}
            fill={d === 8 ? "var(--orange)" : "var(--text)"}
            fillOpacity={d === 8 ? 1 : 0.18}
          />
        ))}
      </g>
      <g className="float-slow" style={float("-3.5s")}>
        <circle cx="186" cy="40" r="16" fill="#fff" fillOpacity="0.9" />
        <path d="M180 44a6 6 0 0 1 12 0v-6a6 6 0 0 0-12 0Z" fill="var(--mustard)" />
        <circle cx="186" cy="48" r="2" fill="var(--mustard)" />
      </g>
      <circle
        className="float-slow"
        style={float("-5s")}
        cx="24"
        cy="150"
        r="6"
        fill="#fff"
        fillOpacity="0.8"
      />
    </svg>
  );
}
