import styles from "@/components/CamperList/CamperList.module.css";

export default function Loading() {
  return (
    <main className={styles.overlay} aria-busy="true">
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
          <h1 className={styles.stateTitle}>Loading camper details...</h1>
          <p className={styles.stateDescription}>
            Please wait while we fetch this camper&apos;s details.
          </p>
        </div>
      </div>
    </main>
  );
}
