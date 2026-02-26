export type GalleryImage = {
  src: string;
  alt: string;
};

export const GALLERY_IMAGES: GalleryImage[] = [
  { src: "https://picsum.photos/seed/ride01/900/1300", alt: "Biker cinematic frame 01" },
  { src: "https://picsum.photos/seed/ride02/900/1000", alt: "Biker cinematic frame 02" },
  { src: "https://picsum.photos/seed/ride03/900/1200", alt: "Biker cinematic frame 03" },
  { src: "https://picsum.photos/seed/ride04/900/1050", alt: "Biker cinematic frame 04" },
  { src: "https://picsum.photos/seed/ride05/900/1400", alt: "Biker cinematic frame 05" },
  { src: "https://picsum.photos/seed/ride06/900/980", alt: "Biker cinematic frame 06" },
  { src: "https://picsum.photos/seed/ride07/900/1280", alt: "Biker cinematic frame 07" },
  { src: "https://picsum.photos/seed/ride08/900/1100", alt: "Biker cinematic frame 08" },
  { src: "https://picsum.photos/seed/ride09/900/1320", alt: "Biker cinematic frame 09" },
  { src: "https://picsum.photos/seed/ride10/900/960", alt: "Biker cinematic frame 10" },
  { src: "https://picsum.photos/seed/ride11/900/1260", alt: "Biker cinematic frame 11" },
  { src: "https://picsum.photos/seed/ride12/900/1080", alt: "Biker cinematic frame 12" },
  { src: "https://picsum.photos/seed/ride13/900/1360", alt: "Biker cinematic frame 13" },
  { src: "https://picsum.photos/seed/ride14/900/1020", alt: "Biker cinematic frame 14" },
  { src: "https://picsum.photos/seed/ride15/900/1240", alt: "Biker cinematic frame 15" },
  { src: "https://picsum.photos/seed/ride16/900/1180", alt: "Biker cinematic frame 16" },
];

export function toMasonryColumns(images: GalleryImage[], columnCount = 4) {
  const columns = Array.from({ length: columnCount }, () => [] as GalleryImage[]);
  images.forEach((image, index) => {
    columns[index % columnCount].push(image);
  });
  return columns;
}
