import Image from "next/image";
import Link from "next/link";
import type {
  CamperEngine,
  CamperForm,
  CamperListItem,
  CamperTransmission,
} from "@/types/camper";
import styles from "./CamperCard.module.css";

const formLabels: Record<CamperForm, string> = {
  alcove: "Alcove",
  panel_van: "Panel Van",
  integrated: "Integrated",
  semi_integrated: "Semi Integrated",
};

const engineLabels: Record<CamperEngine, string> = {
  diesel: "Diesel",
  petrol: "Petrol",
  hybrid: "Hybrid",
  electric: "Electric",
};

const transmissionLabels: Record<CamperTransmission, string> = {
  automatic: "Automatic",
  manual: "Manual",
};

interface CamperCardProps {
  camper: CamperListItem;
}

export default function CamperCard({ camper }: CamperCardProps) {
  const location = camper.location.split(", ").reverse().join(", ");
  const badges = [
    { icon: "petrol", label: engineLabels[camper.engine] },
    { icon: "transmission", label: transmissionLabels[camper.transmission] },
    { icon: "alcove", label: formLabels[camper.form] },
  ];

  return (
    <article className={styles.card} aria-labelledby={`camper-${camper.id}`}>
      <div className={styles.photo}>
        <Image
          className={styles.image}
          src={camper.coverImage}
          alt={camper.name}
          fill
          sizes="(max-width: 600px) calc(100vw - 80px), 219px"
        />
      </div>

      <div className={styles.info}>
        <div className={styles.text}>
          <div className={styles.heading}>
            <h2 className={styles.name} id={`camper-${camper.id}`}>
              {camper.name}
            </h2>
            <p className={styles.price}>
              €
              {camper.price.toLocaleString("en-US", {
                useGrouping: false,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className={styles.details}>
            <span className={styles.detail}>
              <svg
                className={styles.star}
                width="16"
                height="16"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/icons/sprite.svg#icon-star" />
              </svg>
              {camper.rating}({camper.totalReviews}{" "}
              {camper.totalReviews === 1 ? "Review" : "Reviews"})
            </span>
            <span className={styles.detail}>
              <svg width="16" height="16" aria-hidden="true" focusable="false">
                <use href="/icons/sprite.svg#icon-map" />
              </svg>
              {location}
            </span>
          </div>
        </div>

        <p className={styles.description}>{camper.description}</p>

        <ul className={styles.badges} aria-label="Camper specifications">
          {badges.map(({ icon, label }) => (
            <li className={styles.badge} key={icon}>
              <svg width="20" height="20" aria-hidden="true" focusable="false">
                <use href={`/icons/sprite.svg#icon-${icon}`} />
              </svg>
              {label}
            </li>
          ))}
        </ul>

        <Link
          className={styles.button}
          href={`/catalog/${encodeURIComponent(camper.id)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Show more about ${camper.name} (opens in a new tab)`}
        >
          Show more
        </Link>
      </div>
    </article>
  );
}
