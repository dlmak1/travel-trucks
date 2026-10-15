"use client";

import { useState } from "react";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import CamperList from "@/components/CamperList/CamperList";
import Filters from "@/components/Filters/Filters";
import { getCampers } from "@/lib/api";
import type { CamperFilters } from "@/types/camper";
import styles from "./catalog.module.css";

export default function CatalogClient() {
  const [draftFilters, setDraftFilters] = useState<CamperFilters>({});
  const [appliedFilters, setAppliedFilters] = useState<CamperFilters>({});
  const query = useInfiniteQuery({
    queryKey: ["campers", appliedFilters],
    queryFn: ({ pageParam }) =>
      getCampers({ ...appliedFilters, page: pageParam, limit: 4 }),
    initialPageParam: 1,
    placeholderData: keepPreviousData,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    refetchOnWindowFocus: false,
  });

  function applyFilters() {
    setAppliedFilters({
      ...draftFilters,
      location: draftFilters.location?.trim() || undefined,
    });
  }

  function clearFilters() {
    setDraftFilters({});
    setAppliedFilters({});
  }

  const isLoading = query.isPending || query.isFetching;
  const status = isLoading ? "loading" : query.isError ? "error" : "success";
  const campers = query.data?.pages.flatMap((page) => page.campers) ?? [];

  return (
    <main className={`container ${styles.catalog}`}>
      <h1 className={styles.title}>Camper catalog</h1>
      <Filters
        filters={draftFilters}
        onChange={setDraftFilters}
        onSearch={applyFilters}
        onClear={clearFilters}
        isLoading={isLoading}
      />
      <section className={styles.results} aria-label="Available campers">
        <CamperList
          campers={campers}
          status={status}
          onClear={clearFilters}
          onRetry={() => void query.refetch()}
        />
      </section>
    </main>
  );
}
