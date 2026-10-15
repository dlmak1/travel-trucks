import { Suspense } from "react";
import { connection } from "next/server";
import CamperList from "@/components/CamperList/CamperList";
import Filters from "@/components/Filters/Filters";
import { getCampers } from "@/lib/api";
import type { CamperListItem } from "@/types/camper";
import styles from "./catalog.module.css";

async function CatalogResults() {
  await connection();
  let campers: CamperListItem[] = [];
  let status: "success" | "error" = "success";

  try {
    const data = await getCampers({ page: 1, limit: 4 });
    campers = data.campers;
  } catch {
    status = "error";
  }

  return <CamperList campers={campers} status={status} />;
}

export default function CatalogPage() {
  return (
    <main className={`container ${styles.catalog}`}>
      <h1 className={styles.title}>Camper catalog</h1>
      <Filters />
      <section className={styles.results} aria-label="Available campers">
        <Suspense fallback={<CamperList campers={[]} status="loading" />}>
          <CatalogResults />
        </Suspense>
      </section>
    </main>
  );
}
