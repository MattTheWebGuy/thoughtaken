import "server-only";

import { promises as fs } from "fs";
import path from "path";
import { GALLERY_IMAGES, type GalleryImage } from "./gallery-images";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

function toAltFromFilename(fileName: string) {
  const stem = fileName.replace(/\.[^/.]+$/, "");
  return stem.replace(/[-_]+/g, " ").trim() || "Gallery image";
}

export async function getGalleryImages() {
  const galleryDir = path.join(process.cwd(), "public", "gallary");

  try {
    const dirEntries = await fs.readdir(galleryDir, { withFileTypes: true });

    const localImages: GalleryImage[] = dirEntries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((fileName) => IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase()))
      .sort((first, second) => first.localeCompare(second, undefined, { numeric: true }))
      .map((fileName) => ({
        src: `/gallary/${fileName}`,
        alt: toAltFromFilename(fileName),
      }));

    return localImages.length > 0 ? localImages : GALLERY_IMAGES;
  } catch {
    return GALLERY_IMAGES;
  }
}
