"use client";

import { useState } from "react";
import Image from "next/image";
import type { CamperImage } from "@/types/camper";
import styles from "./CamperGallery.module.css";

interface CamperGalleryProps {
  gallery: CamperImage[];
  name: string;
}

export default function CamperGallery({ gallery, name }: CamperGalleryProps) {
  const images = [...gallery].sort((a, b) => a.order - b.order);
  const [selectedId, setSelectedId] = useState(images[0]?.id);
  const selectedImage = images.find((image) => image.id === selectedId) ?? images[0];

  if (!selectedImage) {
    return (
      <div className={styles.empty} role="status">
        Photos are not available for this camper.
      </div>
    );
  }

  return (
    <section className={styles.gallery} aria-label={`${name} photos`}>
      <div className={styles.mainPhoto}>
        <Image
          className={styles.image}
          src={selectedImage.original}
          alt={`${name}, photo ${images.indexOf(selectedImage) + 1}`}
          fill
          loading="eager"
          sizes="(max-width: 600px) calc(100vw - 32px), (max-width: 1199px) calc(100vw - 64px), 638px"
        />
      </div>
      <div className={styles.thumbnails}>
        {images.map((image, index) => (
          <button
            className={styles.thumbnail}
            type="button"
            key={image.id}
            aria-label={`View photo ${index + 1} of ${name}`}
            aria-pressed={image.id === selectedImage.id}
            onClick={() => setSelectedId(image.id)}
          >
            <Image
              className={styles.image}
              src={image.thumb}
              alt={`${name}, thumbnail ${index + 1}`}
              fill
              sizes="(max-width: 1199px) 25vw, 136px"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
