import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.container}`}>
        <div className={styles.content}>
          <div className={styles.text}>
            <h1 id="hero-title" className={styles.title}>
              Campers of your dreams
            </h1>
            <p className={styles.subtitle}>
              You can find everything you want in our catalog
            </p>
          </div>
          <Link className={styles.button} href="/catalog">
            View Now
          </Link>
        </div>
      </div>
    </section>
  );
}
