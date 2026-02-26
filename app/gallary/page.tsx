import Link from "next/link";
import GalleryMasonry from "../components/GalleryMasonry";
import { getGalleryImages } from "../lib/gallery-loader";

export default async function GallaryPage() {
  const images = await getGalleryImages();

  return (
    <div className="min-h-screen bg-black px-4 pb-16 pt-28 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between pb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
            THOUGHTAKEN ARCHIVE
          </p>
          <h1 className="mt-2 text-3xl font-extrabold uppercase md:text-5xl">
            Full Gallary
          </h1>
        </div>
        <Link
          href="/"
          className="rounded-full border border-neutral-700 px-5 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-gray-200 transition-colors duration-300 hover:bg-white hover:text-black"
        >
          Back Home
        </Link>
      </div>

      <GalleryMasonry images={images} enableLightbox />
    </div>
  );
}
