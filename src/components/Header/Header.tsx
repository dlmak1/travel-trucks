"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalog" },
] as const;

function isActivePath(href: (typeof navigation)[number]["href"], pathname: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.logoLink} href="/" aria-label="TravelTrucks home">
          <Image
            className={styles.logo}
            src="/images/logo.svg"
            alt="TravelTrucks"
            width={136}
            height={16}
            priority
          />
        </Link>

        <nav className={styles.navigation} aria-label="Main navigation">
          {navigation.map(({ href, label }) => {
            const isActive = isActivePath(href, pathname);

            return (
              <Link
                key={href}
                className={`${styles.navigationLink} ${
                  isActive ? styles.active : ""
                }`}
                href={href}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
