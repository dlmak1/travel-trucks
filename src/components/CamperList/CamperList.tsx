import Image from "next/image";
import CamperCard from "@/components/CamperCard/CamperCard";
import type { CamperListItem } from "@/types/camper";
import styles from "./CamperList.module.css";

interface CamperListProps {
  campers: CamperListItem[];
  status?: "success" | "loading" | "error";
  onClear: () => void;
  onRetry: () => void;
}

export default function CamperList({
  campers,
  status = "success",
  onClear,
  onRetry,
}: CamperListProps) {
  if (status === "error") {
    return (
      <div className={`${styles.state} ${styles.error}`} role="alert">
        <svg width="24" height="24" aria-hidden="true" focusable="false">
          <use href="/icons/sprite.svg#icon-alert-circle" />
        </svg>
        <h2 className={styles.stateTitle}>Couldn&apos;t load campers</h2>
        <p className={styles.stateDescription}>
          Please try again to see the available campers.
        </p>
        <button
          className={styles.primaryButton}
          type="button"
          onClick={onRetry}
        >
          Retry
        </button>
      </div>
    );
  }

  const isLoading = status === "loading";

  if (campers.length === 0 && !isLoading) {
    return (
      <div className={`${styles.state} ${styles.empty}`} role="status">
        <Image
          className={styles.emptyImage}
          src="/images/catalog-empty.webp"
          alt=""
          width={488}
          height={463}
          sizes="(max-width: 600px) calc(100vw - 32px), 488px"
        />
        <h2 className={styles.stateTitle}>No campers found</h2>
        <p className={styles.stateDescription}>
          We couldn&apos;t find any campers that match your filters.
          <br />
          Try adjusting your search or clearing some filters.
        </p>
        <div className={styles.stateActions}>
          <button
            className={styles.secondaryButton}
            type="reset"
            form="catalog-filters"
          >
            <svg width="20" height="20" aria-hidden="true" focusable="false">
              <use href="/icons/sprite.svg#icon-close" />
            </svg>
            Clear filters
          </button>
          <button
            className={styles.primaryButton}
            type="button"
            onClick={onClear}
          >
            View all campers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={isLoading ? styles.loadingStage : undefined}>
      <ul
        className={styles.list}
        aria-label="Camper results"
        aria-busy={isLoading}
        inert={isLoading}
      >
        {campers.map((camper) => (
          <li key={camper.id}>
            <CamperCard camper={camper} />
          </li>
        ))}
      </ul>
      {isLoading && (
        <div className={styles.overlay}>
          <div className={styles.loadingDialog} role="status" aria-live="polite">
            <svg
              className={styles.loader}
              width="72"
              height="72"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/icons/sprite.svg#icon-loader" />
            </svg>
            <div>
              <h2 className={styles.stateTitle}>Loading tracks...</h2>
              <p className={styles.stateDescription}>
                Please wait while we fetch the best
                <br />
                travel trucks for you
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
