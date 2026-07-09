// Marca AeroSwift recreada como SVG (dos bandas inclinadas en degradado navy).
// tone="onLight" para fondos claros, tone="onDark" para fondos oscuros.

export function Logo({
  tone = "onLight",
  withText = true,
  className = "",
}: {
  tone?: "onLight" | "onDark";
  withText?: boolean;
  className?: string;
}) {
  const gradId = tone === "onDark" ? "asLogoGradLight" : "asLogoGradDark";
  const stops =
    tone === "onDark"
      ? ["#cfd4df", "#ffffff"]
      : ["#141b26", "#3a4557"];
  const textColor = tone === "onDark" ? "text-white" : "text-onyx";
  const tagColor = tone === "onDark" ? "text-bone/60" : "text-ink-soft";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 128 84" className="h-9 w-auto" aria-hidden>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0.4">
            <stop offset="0" stopColor={stops[0]} />
            <stop offset="1" stopColor={stops[1]} />
          </linearGradient>
        </defs>
        {/* Banda superior (ala) */}
        <polygon points="40,8 108,8 122,30 54,30" fill={`url(#${gradId})`} />
        {/* Acento cuadrado izquierdo de la banda inferior */}
        <rect x="8" y="40" width="12" height="24" fill={`url(#${gradId})`} />
        {/* Banda inferior */}
        <polygon points="26,40 96,40 74,64 4,64" fill={`url(#${gradId})`} opacity="0.92" />
      </svg>
      {withText && (
        <span className="flex flex-col leading-none">
          <span className={`font-display text-xl font-bold tracking-tight ${textColor}`}>
            AeroSwift
          </span>
          <span className={`mt-1 text-[9px] font-semibold uppercase tracking-[0.35em] ${tagColor}`}>
            Executive
          </span>
        </span>
      )}
    </span>
  );
}
