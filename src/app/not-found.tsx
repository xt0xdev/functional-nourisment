import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-clay">404</p>
      <h1 className="mt-3 font-serif text-4xl text-forest">This page has gone quiet.</h1>
      <p className="mt-4 text-muted">The page you are looking for is not available. Return home or book a visit.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="rounded-full bg-forest px-5 py-2 text-cream">
          Home
        </Link>
        <Link href="/book" className="rounded-full border border-forest px-5 py-2 text-forest">
          Book
        </Link>
      </div>
    </div>
  );
}
