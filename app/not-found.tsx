import Link from "next/link";

export default function NotFound() {
  return (
    <section className="phead" style={{ minHeight: "80svh", display: "grid", alignItems: "center" }}>
      <div className="wrap phead-text" style={{ gap: 24 }}>
        <h1 className="t-xl">Ezt az oldalt nem találom</h1>
        <p className="t-lead" style={{ color: "var(--on-dark-2)" }}>Lehet, hogy elírás van a címben, vagy az oldal már nem létezik.</p>
        <p><Link href="/" className="btn btn-lime">Vissza a kezdőlapra</Link></p>
      </div>
    </section>
  );
}
