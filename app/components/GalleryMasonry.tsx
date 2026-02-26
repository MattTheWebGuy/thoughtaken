"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { BiX } from "react-icons/bi";
import type { GalleryImage } from "../lib/gallery-images";
import { toMasonryColumns } from "../lib/gallery-images";

type GalleryMasonryProps = {
  images: GalleryImage[];
  enableLightbox?: boolean;
};

export default function GalleryMasonry({
  images,
  enableLightbox = false,
}: GalleryMasonryProps) {
  const columns = useMemo(() => toMasonryColumns(images), [images]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    if (!selectedImage) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedImage]);

  return (
    <>
      <div className="flex flex-wrap px-2">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="w-full px-2 md:w-1/2 lg:w-1/4">
            <div className="flex flex-col gap-2">
              {column.map((image) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => {
                    if (enableLightbox) {
                      setSelectedImage(image);
                    }
                  }}
                  className="cursor-pointer touch-manipulation text-left"
                  aria-label={`Open ${image.alt}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={900}
                    height={1300}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    decoding="async"
                    className="h-auto w-full rounded-lg object-cover transition-all duration-500 hover:scale-105"
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {enableLightbox && selectedImage ? (
        <div
          className="fixed inset-0 z-70 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-4 top-4 cursor-pointer rounded-full border border-neutral-700 bg-black/70 p-2 text-white"
            aria-label="Close preview"
          >
            <BiX className="text-3xl" />
          </button>

          <div
            className="max-h-[90vh] max-w-[92vw]"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              width={1400}
              height={1800}
              className="max-h-[90vh] w-auto rounded-xl object-contain"
              priority
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
