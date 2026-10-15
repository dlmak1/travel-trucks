import Link from "next/link";
import styles from "./page.module.css";

export default function CamperNotFound() {
  return (
    <main className={`container ${styles.unavailable}`}>
      <h1>Camper not found</h1>
      <p>This camper is no longer available or the link is incorrect.</p>
      <Link href="/catalog">Back to catalog</Link>
    </main>
  );
}
