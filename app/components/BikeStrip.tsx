import Image from "next/image";
import { SITE_CONFIG } from "../lib/site-config";

export default function BikeStrip() {
  return (
    <section
      id="bike-strip"
      className="relative h-36 w-full overflow-hidden bg-black sm:h-[200px]"
    >
      <Image
        src={SITE_CONFIG.images.bikeStrip || SITE_CONFIG.images.productFallback}
        alt="Side profile motorcycle"
        fill
        sizes="100vw"
        className="object-contain object-center sm:object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25" />
    </section>
  );
}
