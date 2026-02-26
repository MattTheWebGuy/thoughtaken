import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 py-20 text-white">
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-950 p-8 text-center sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Error 404</p>
        <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">Page not found</h1>
        <p className="mt-4 text-sm text-gray-300 sm:text-base">
          This route does not exist anymore or may have moved. Head back to the main ride hub.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-full bg-white px-7 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-black transition-colors hover:bg-gray-200"
          >
            Go Home
          </Link>
          <a
            href="https://youtube.com/@thoughtaken"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-neutral-700 px-7 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-neutral-900"
          >
            Watch YouTube
          </a>
        </div>
      </div>
    </main>
  );
}
