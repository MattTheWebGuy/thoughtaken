import Link from "next/link";
import GalleryMasonry from "./GalleryMasonry";
import { getGalleryImages } from "../lib/gallery-loader";

export default async function Gallery() {
  const images = await getGalleryImages();
  const previewImages = images.slice(0, 8);

  return (
    <section
      id="gallery"
      className="flex min-h-svh items-center justify-center bg-black px-4 py-20 sm:px-6"
    >
      <div className="mx-auto w-full max-w-7xl">
        <h2 className="mb-8 text-center text-2xl font-extrabold text-white sm:mb-10 sm:text-3xl md:text-5xl">
          The Culture
        </h2>

        <p className="mx-auto mb-8 max-w-3xl text-center text-sm leading-7 text-gray-300 sm:text-base md:mb-10 md:text-lg md:leading-8">
          The gallery isn’t just pictures. It’s the lifestyle. Midnight rides.
          Highway pulls. Gas station meetups. Chrome under city lights. This is
          what the community looks like.
        </p>

        <GalleryMasonry images={previewImages} />

        <div className="mt-10 flex justify-center">
          <Link
            href="/gallary"
            className="inline-flex rounded-full border border-gray-700 bg-white px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition-all duration-300 hover:scale-105"
          >
            View More
          </Link>
        </div>
      </div>
    </section>
  );
}
