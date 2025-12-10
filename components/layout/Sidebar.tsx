"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const items = [
  { href: "/org-chart", icon: "/Home.svg", label: "Home" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="w-full">

      {/* Black square app/menu block (85x60) — placed outside the padded nav so it stays flush */}
      <div className="mb-3 px-0">
        <div role="img" aria-label="App menu" className="flex items-center justify-center w-[85px] h-[60px] bg-black">
          <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="5" cy="4" r="1.6" fill="#fff" />
            <circle cx="14" cy="4" r="1.6" fill="#fff" />
            <circle cx="23" cy="4" r="1.6" fill="#fff" />

            <circle cx="5" cy="10" r="1.6" fill="#fff" />
            <circle cx="14" cy="10" r="1.6" fill="#fff" />
            <circle cx="23" cy="10" r="1.6" fill="#fff" />

            <circle cx="5" cy="16" r="1.6" fill="#fff" />
            <circle cx="14" cy="16" r="1.6" fill="#fff" />
            <circle cx="23" cy="16" r="1.6" fill="#fff" />
          </svg>
        </div>
      </div>

      <nav className="flex flex-col items-start gap-2 py-4 px-3 w-full">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href === "#people" ? "/org-chart" : item.href}
          className={clsx(
            "flex items-center justify-center gap-3 px-3 py-2 rounded-md w-full",
            pathname === "/org-chart" && item.href === "/org-chart"
              ? "bg-neutral-900 text-white"
              : "text-neutral-500 hover:bg-neutral-100"
          )}
        >
          <img src={item.icon} alt={item.label} className={clsx("w-5 h-5 flex-shrink-0", pathname === "/org-chart" && item.href === "/org-chart" ? "brightness-0 invert" : "")} />
        </Link>
      ))}
      </nav>
    </div>
  );
}
