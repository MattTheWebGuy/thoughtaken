"use client";

import Image from "next/image";
import { useState } from "react";
import { SITE_CONFIG } from "../lib/site-config";

const productsSection = SITE_CONFIG.sections.products;
const itemsWithAssets = productsSection.items;

export default function Products() {
  const [activeImageIndexes, setActiveImageIndexes] = useState<number[]>(
    () => itemsWithAssets.map(() => 0),
  );
  const [slideDirections, setSlideDirections] = useState<number[]>(
    () => itemsWithAssets.map(() => 1),
  );

  const goToImage = (productIndex: number, imageIndex: number) => {
    setSlideDirections((current) => {
      const next = [...current];
      const currentIndex = activeImageIndexes[productIndex] ?? 0;
      next[productIndex] = imageIndex >= currentIndex ? 1 : -1;
      return next;
    });

    setActiveImageIndexes((current) => {
      const next = [...current];
      next[productIndex] = imageIndex;
      return next;
    });
  };

  const stepImage = (productIndex: number, direction: 1 | -1) => {
    setSlideDirections((current) => {
      const next = [...current];
      next[productIndex] = direction;
      return next;
    });

    setActiveImageIndexes((current) => {
      const next = [...current];
      const imageCount = itemsWithAssets[productIndex].images.length;
      if (imageCount === 0) {
        next[productIndex] = 0;
        return next;
      }

      next[productIndex] =
        (next[productIndex] + direction + imageCount) % imageCount;
      return next;
    });
  };

  return (
    <section
      id="products"
      className="bg-black px-4 py-14 sm:px-6 md:px-20"
    >
      <div className="mx-auto w-full max-w-7xl">
        <h2 className="text-center text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">
          {productsSection.title}
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {itemsWithAssets.map((item, productIndex) => (
            <article
              key={item.name}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950"
            >
              <div className="relative h-64 w-full bg-[radial-gradient(circle_at_18%_16%,#3b3d44_0%,#27282d_34%,#17181b_70%,#0f1012_100%)] sm:h-72">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.02)_22%,rgba(23,30,43,0.14)_46%,rgba(6,7,9,0.5)_100%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_78%,rgba(54,58,70,0.34)_0%,rgba(10,11,14,0)_55%)]" />
                <a
                  href={item.shopLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-[1]"
                  aria-label={`Open ${item.name} product page`}
                >
                  <Image
                    key={`${item.slug}-${activeImageIndexes[productIndex]}`}
                    src={item.images[activeImageIndexes[productIndex]] ?? SITE_CONFIG.images.productFallback}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={`object-contain p-3 ${
                      (slideDirections[productIndex] ?? 1) > 0
                        ? "product-slide-in-right"
                        : "product-slide-in-left"
                    }`}
                  />
                </a>

                <button
                  type="button"
                  onClick={() => stepImage(productIndex, -1)}
                  className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/70 bg-black/50 px-3 py-1 text-lg font-bold text-white transition-colors hover:bg-black/70"
                  aria-label="Previous product image"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => stepImage(productIndex, 1)}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/70 bg-black/50 px-3 py-1 text-lg font-bold text-white transition-colors hover:bg-black/70"
                  aria-label="Next product image"
                >
                  ›
                </button>

                <span className="limited-badge-animated absolute right-3 top-3 z-10 rounded-full border border-black bg-white px-4 py-1 text-[11px] font-extrabold tracking-[0.14em] text-black uppercase">
                  {productsSection.badgeText}
                </span>

                <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5">
                  {item.images.map((_, imageIndex) => (
                    <button
                      key={`${item.name}-${imageIndex}`}
                      type="button"
                      onClick={() => goToImage(productIndex, imageIndex)}
                      className={`h-2 w-2 rounded-full transition-all ${
                        activeImageIndexes[productIndex] === imageIndex
                          ? "bg-white"
                          : "bg-white/40 hover:bg-white/70"
                      }`}
                      aria-label={`View image ${imageIndex + 1}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6 md:p-7">
                <h3 className="text-xl font-bold text-white sm:text-2xl">{item.name}</h3>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-gray-200">
                  {item.price}
                </p>
                <p className="mt-3 flex-1 text-sm leading-6 text-gray-300">
                  {item.description}
                </p>
                <a
                  href={item.shopLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex rounded-full bg-white px-6 py-2 text-sm font-semibold uppercase tracking-[0.15em] text-black transition-colors hover:bg-gray-200"
                >
                  {productsSection.buyButtonLabel}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
