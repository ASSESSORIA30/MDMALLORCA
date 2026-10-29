import Link from "next/link";
export default function NotFound() {
  return (
    <main className="legal-page section">
      <p className="eyebrow">MODULARDOM / 404</p>
      <h1>A different direction.</h1>
      <p>This page could not be found.</p>
      <Link className="arrow-link" href="/en">
        Return to Mallorca ↗
      </Link>
    </main>
  );
}
