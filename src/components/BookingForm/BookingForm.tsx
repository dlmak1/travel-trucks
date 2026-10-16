"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { Manrope } from "next/font/google";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { createBookingRequest } from "@/lib/api";
import type { BookingRequest } from "@/types/booking";
import styles from "./BookingForm.module.css";

const manrope = Manrope({
  variable: "--font-booking-error",
  subsets: ["latin"],
  display: "swap",
});

type FieldName = keyof BookingRequest;
type FieldErrors = Partial<Record<FieldName, string>>;

const fields = [
  { name: "name", label: "Name*", type: "text", autoComplete: "name" },
  { name: "email", label: "Email*", type: "email", autoComplete: "email" },
] as const;

function validateField(input: HTMLInputElement): string | undefined {
  const trimmed = input.value.trim();

  if (input.name === "name") {
    return /\p{L}/u.test(trimmed) && /^[\p{L}\p{M}\s.'’-]+$/u.test(trimmed)
      ? undefined
      : "Please enter your name.";
  }

  return !input.validity.typeMismatch && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
    ? undefined
    : "Please enter your email.";
}

function getErrorMessage(error: Error): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 404) {
      return "This camper is no longer available. Please choose another camper.";
    }
    if (error.response?.status === 400) {
      return "Please check your name and email and try again.";
    }
    if (!error.response) {
      return "Unable to confirm your request. Please check your connection and try again.";
    }
  }

  return "Unable to send your request. Please try again.";
}

export default function BookingForm({ camperId }: { camperId: string }) {
  const id = useId();
  const [values, setValues] = useState<BookingRequest>({ name: "", email: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const submitting = useRef(false);
  const mutation = useMutation({
    mutationFn: (data: BookingRequest) => createBookingRequest(camperId, data),
    retry: false,
    onSuccess: () => {
      setValues({ name: "", email: "" });
      setErrors({});
    },
    onSettled: () => {
      submitting.current = false;
    },
  });

  function handleChange(name: FieldName, input: HTMLInputElement) {
    const value = input.value;
    const error = validateField(input);
    setValues((previous) => ({ ...previous, [name]: value }));
    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: error,
      }));
    }
    if (!mutation.isPending) mutation.reset();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    const nextErrors: FieldErrors = {};
    for (const { name } of fields) {
      const input = event.currentTarget.elements.namedItem(name);
      if (input instanceof HTMLInputElement) nextErrors[name] = validateField(input);
    }
    setErrors(nextErrors);
    mutation.reset();

    const invalidField = fields.find((field) => nextErrors[field.name]);
    if (invalidField) {
      const input = event.currentTarget.elements.namedItem(invalidField.name);
      if (input instanceof HTMLInputElement) input.focus();
      return;
    }

    submitting.current = true;
    mutation.mutate({ name: values.name.trim(), email: values.email.trim() });
  }

  return (
    <section
      className={`${styles.booking} ${manrope.variable}`}
      aria-labelledby={`${id}-heading`}
    >
      <h2 id={`${id}-heading`} className={styles.heading}>
        Book your campervan now
      </h2>
      <p id={`${id}-description`} className={styles.subtitle}>
        Stay connected! We are always ready to help you.
      </p>
      <form
        className={styles.form}
        aria-labelledby={`${id}-heading`}
        aria-describedby={`${id}-description`}
        aria-busy={mutation.isPending}
        noValidate
        onSubmit={handleSubmit}
      >
        <div className={styles.fields}>
          {fields.map(({ name, label, type, autoComplete }) => (
            <div key={name}>
              <div className={styles.field}>
                <input
                  id={`${id}-${name}`}
                  className={
                    name === "name" && errors.name
                      ? `${styles.input} ${styles.invalidName}`
                      : styles.input
                  }
                  name={name}
                  type={type}
                  autoComplete={autoComplete}
                  placeholder={label}
                  required
                  disabled={mutation.isPending}
                  value={values[name]}
                  aria-invalid={Boolean(errors[name])}
                  aria-describedby={errors[name] ? `${id}-${name}-error` : undefined}
                  onChange={(event) => handleChange(name, event.currentTarget)}
                  onBlur={(event) => {
                    if (submitting.current) return;
                    const error = validateField(event.currentTarget);
                    setErrors((previous) => ({
                      ...previous,
                      [name]: error,
                    }));
                  }}
                />
                <label
                  className={
                    errors[name] ? styles.errorLabel : styles.hiddenLabel
                  }
                  htmlFor={`${id}-${name}`}
                >
                  {label}
                </label>
                {errors[name] && (
                  <Image
                    className={styles.errorIcon}
                    src="/icons/booking-error.svg"
                    alt=""
                    width={24}
                    height={24}
                    aria-hidden="true"
                  />
                )}
              </div>
              {errors[name] && (
                <p id={`${id}-${name}-error`} className={styles.error} role="alert">
                  {errors[name]}
                </p>
              )}
            </div>
          ))}
        </div>
        <button className={styles.send} type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Sending..." : "Send"}
        </button>
        {mutation.isSuccess && (
          <p className={styles.result} role="status">
            {mutation.data.message}
          </p>
        )}
        {mutation.isError && (
          <p className={`${styles.result} ${styles.error}`} role="alert">
            {getErrorMessage(mutation.error)}
          </p>
        )}
      </form>
    </section>
  );
}
