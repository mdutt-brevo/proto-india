/**
 * GearLoader — interlocking gear animation for page transitions.
 * Two gears mesh together and rotate in opposite directions,
 * like the internal mechanism of a mould press.
 */
export default function GearLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="relative w-24 h-24">
        {/* Primary gear — rotates clockwise */}
        <svg
          className="absolute top-0 left-0 w-16 h-16 text-primary-500 animate-gear-spin"
          viewBox="0 0 64 64"
          fill="currentColor"
        >
          <path d="M32 8 L35 0 L29 0Z M32 56 L35 64 L29 64Z M8 32 L0 35 L0 29Z M56 32 L64 35 L64 29Z M13.5 13.5 L8 6 L6 8Z M50.5 13.5 L56 6 L58 8Z M13.5 50.5 L6 56 L8 58Z M50.5 50.5 L58 56 L56 58Z" />
          <circle cx="32" cy="32" r="20" />
          <circle cx="32" cy="32" r="8" fill="white" />
        </svg>

        {/* Secondary gear — rotates counter-clockwise, offset to mesh */}
        <svg
          className="absolute bottom-0 right-0 w-12 h-12 text-accent-500 animate-gear-spin-reverse"
          viewBox="0 0 64 64"
          fill="currentColor"
        >
          <path d="M32 8 L35 0 L29 0Z M32 56 L35 64 L29 64Z M8 32 L0 35 L0 29Z M56 32 L64 35 L64 29Z M13.5 13.5 L8 6 L6 8Z M50.5 13.5 L56 6 L58 8Z M13.5 50.5 L6 56 L8 58Z M50.5 50.5 L58 56 L56 58Z" />
          <circle cx="32" cy="32" r="18" />
          <circle cx="32" cy="32" r="6" fill="white" />
        </svg>
      </div>

      <p className="text-sm text-surface-800/50 dark:text-white/40 font-mono tracking-wider uppercase">
        Machining...
      </p>
    </div>
  );
}
