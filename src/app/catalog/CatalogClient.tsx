"use client";

import { useState } from "react";
import {
  hashKey,
  keepPreviousData,
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import CamperList from "@/components/CamperList/CamperList";
import Filters from "@/components/Filters/Filters";
import { getCampers } from "@/lib/api";
import type { CamperFilters, CampersResponse } from "@/types/camper";
import styles from "./catalog.module.css";

export default function CatalogClient() {
  const queryClient = useQueryClient();
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

  async function changeAppliedFilters(filters: CamperFilters) {
    const queryKey = ["campers", filters];
    if (hashKey(queryKey) === hashKey(["campers", appliedFilters])) return;

    await queryClient.cancelQueries({ queryKey, exact: true });
    const updatedAt = queryClient.getQueryState(queryKey)?.dataUpdatedAt;
    queryClient.setQueryData<InfiniteData<CampersResponse, number>>(
      queryKey,
      (data) =>
        data
          ? {
              ...data,
              pages: data.pages.slice(0, 1),
              pageParams: data.pageParams.slice(0, 1),
            }
          : undefined,
      { updatedAt },
    );
    setAppliedFilters(filters);
  }

  function applyFilters() {
    void changeAppliedFilters({
      ...draftFilters,
      location: draftFilters.location?.trim() || undefined,
    });
  }

  function clearFilters() {
    setDraftFilters({});
    void changeAppliedFilters({});
  }

  function loadMore() {
    if (query.hasNextPage && !query.isFetching && !query.isPlaceholderData) {
      void query.fetchNextPage({ cancelRefetch: false });
    }
  }

  const isLoading =
    query.isPending || (query.isFetching && !query.isFetchingNextPage);
  const status = isLoading
    ? "loading"
    : query.isError && !query.isFetchNextPageError
      ? "error"
      : "success";
  const seenIds = new Set<string>();
  const campers = (query.data?.pages.flatMap((page) => page.campers) ?? []).filter(
    (camper) => {
      if (seenIds.has(camper.id)) return false;
      seenIds.add(camper.id);
      return true;
    },
  );

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
          hasNextPage={query.hasNextPage}
          isFetchingNextPage={query.isFetchingNextPage}
          nextPageError={query.isFetchNextPageError}
          onLoadMore={loadMore}
        />
      </section>
    </main>
  );
}
