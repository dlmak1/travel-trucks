import type { ReactNode } from "react";
import type { CamperReview } from "@/types/camper";
import styles from "./Reviews.module.css";

type ReviewsProps =
  | { status: "success"; reviews: CamperReview[] }
  | { status: "loading" }
  | { status: "error"; camperId: string };

export default function Reviews(props: ReviewsProps) {
  let content: ReactNode;

  if (props.status === "loading") {
    content = (
      <p className={styles.notice} role="status">
        Loading reviews...
      </p>
    );
  } else if (props.status === "error") {
    content = (
      <div className={styles.notice} role="alert">
        <p>Unable to load reviews. Please try again.</p>
        <form
          action={`/catalog/${encodeURIComponent(props.camperId)}#reviews-heading`}
          method="get"
        >
          <button className={styles.retry} type="submit">
            Retry
          </button>
        </form>
      </div>
    );
  } else if (props.reviews.length === 0) {
    content = (
      <p className={styles.notice} role="status">
        No reviews yet for this camper.
      </p>
    );
  } else {
    content = (
      <ul className={styles.list}>
        {props.reviews.map((review) => (
          <li className={styles.review} key={review.id}>
            <div className={styles.person}>
              <span className={styles.avatar} aria-hidden="true">
                {review.reviewer_name.trim().charAt(0).toUpperCase()}
              </span>
              <div className={styles.authorDetails}>
                <h3 className={styles.author}>{review.reviewer_name}</h3>
                <div
                  className={styles.rating}
                  role="img"
                  aria-label={`Rating: ${review.reviewer_rating} out of 5`}
                >
                  {Array.from({ length: 5 }, (_, index) => (
                    <svg
                      className={
                        index + 1 <= review.reviewer_rating
                          ? styles.activeStar
                          : styles.inactiveStar
                      }
                      width="16"
                      height="16"
                      key={index}
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/icons/sprite.svg#icon-star" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p className={styles.comment}>{review.comment}</p>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section
      className={styles.reviews}
      aria-labelledby="reviews-heading"
      aria-busy={props.status === "loading"}
    >
      <h2 id="reviews-heading" className={styles.title}>
        Reviews
      </h2>
      {content}
    </section>
  );
}
