import { cache, Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isAxiosError } from "axios";
import CamperGallery from "@/components/CamperGallery/CamperGallery";
import Reviews from "@/components/Reviews/Reviews";
import { getCamperById, getCamperReviews } from "@/lib/api";
import type {
  CamperAmenity,
  CamperEngine,
  CamperForm,
  CamperTransmission,
} from "@/types/camper";
import styles from "./page.module.css";

const getCamper = cache(async (id: string) => {
  try {
    return await getCamperById(id);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) notFound();
    return null;
  }
});

async function CamperReviews({ camperId }: { camperId: string }) {
  const reviews = await getCamperReviews(camperId).catch(() => null);

  if (reviews === null) {
    return <Reviews status="error" camperId={camperId} />;
  }

  return <Reviews status="success" reviews={reviews} />;
}

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

const amenityLabels: Record<CamperAmenity, string> = {
  ac: "AC",
  bathroom: "Bathroom",
  kitchen: "Kitchen",
  tv: "TV",
  radio: "Radio",
  refrigerator: "Refrigerator",
  microwave: "Microwave",
  gas: "Gas",
  water: "Water",
};

export async function generateMetadata({
  params,
}: PageProps<"/catalog/[camperId]">): Promise<Metadata> {
  const { camperId } = await params;
  const camper = await getCamper(camperId);
  return {
    title: camper
      ? `${camper.name} | TravelTrucks`
      : "Camper unavailable | TravelTrucks",
  };
}

export default async function CamperDetailsPage({
  params,
}: PageProps<"/catalog/[camperId]">) {
  const { camperId } = await params;
  const camper = await getCamper(camperId);

  if (!camper) {
    return (
      <main className={`container ${styles.unavailable}`}>
        <h1>Unable to load camper</h1>
        <p>Please try again to see this camper&apos;s details.</p>
        <form action={`/catalog/${encodeURIComponent(camperId)}`} method="get">
          <button className={styles.retry} type="submit">
            Retry
          </button>
        </form>
        <Link href="/catalog">Back to catalog</Link>
      </main>
    );
  }

  const location = camper.location.split(", ").reverse().join(", ");
  const badges = [
    transmissionLabels[camper.transmission],
    ...(camper.amenities.includes("ac") ? [amenityLabels.ac] : []),
    engineLabels[camper.engine],
    ...camper.amenities
      .filter((amenity) => amenity !== "ac")
      .map((amenity) => amenityLabels[amenity]),
    formLabels[camper.form],
  ];
  const specifications = [
    ["Form", formLabels[camper.form]],
    ["Length", camper.length],
    ["Width", camper.width],
    ["Height", camper.height],
    ["Tank", camper.tank],
    ["Consumption", camper.consumption],
  ];

  return (
    <main className={`container ${styles.details}`}>
      <div className={styles.top}>
        <CamperGallery gallery={camper.gallery} name={camper.name} />
        <div className={styles.information}>
          <section className={styles.summary} aria-labelledby="camper-name">
            <h1 id="camper-name" className={styles.title}>
              {camper.name}
            </h1>
            <div className={styles.metadata}>
              <span className={styles.metadataItem}>
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
              <span className={styles.metadataItem}>
                <svg width="16" height="16" aria-hidden="true" focusable="false">
                  <use href="/icons/sprite.svg#icon-map" />
                </svg>
                {location}
              </span>
            </div>
            <p className={styles.price}>
              €
              {camper.price.toLocaleString("en-US", {
                useGrouping: false,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className={styles.description}>{camper.description}</p>
          </section>

          <section className={styles.features} aria-labelledby="vehicle-details">
            <h2 id="vehicle-details" className={styles.title}>
              Vehicle details
            </h2>
            <ul
              className={styles.badges}
              aria-label="Camper specifications and amenities"
            >
              {badges.map((label) => (
                <li className={styles.badge} key={label}>
                  {label}
                </li>
              ))}
            </ul>
            <dl className={styles.specifications}>
              {specifications.map(([label, value]) => (
                <div className={styles.specification} key={label}>
                  <dt>{label}</dt>
                  <dd>
                    {value.replace(/(\d)(m|l)/g, "$1 $2").replace("/", " / ")}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>

      <div className={styles.lower}>
        <Suspense fallback={<Reviews status="loading" />}>
          <CamperReviews camperId={camper.id} />
        </Suspense>
        <section className={styles.booking} aria-labelledby="booking-heading">
          <h2 id="booking-heading">Book your campervan now</h2>
          <p className={styles.bookingSubtitle}>
            Stay connected! We are always ready to help you.
          </p>
          <p className={styles.bookingNotice}>
            Booking is currently unavailable.
          </p>
        </section>
      </div>
    </main>
  );
}
