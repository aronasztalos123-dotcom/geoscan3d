/**
 * Az oldal egyetlen motívuma: az illesztőpont-tábla (sakktábla-mintás kör, négy negyed,
 * két kitöltött). Ezzel illeszti a földmérő a pontfelhőt EOV-ba.
 * A szín a currentColor-ból jön; a világos negyedek a --target-light változóból.
 */
export function Target({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <circle cx="10" cy="10" r="10" fill="var(--target-light, #fff)" />
      <path d="M10 10V0A10 10 0 0 1 20 10Z M10 10V20A10 10 0 0 1 0 10Z" fill="currentColor" />
    </svg>
  );
}
