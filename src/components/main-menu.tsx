"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Groups", href: "/groups" },
  { label: "Bills", href: "/bills" },
];

export function MainMenu() {
  const path = usePathname();

  return (
    <nav className="hidden w-1/3 flex-shrink-0 justify-center md:flex ">
      <ul className="flex gap-4">
        {menuItems.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className={cn(
                path === item.href && "underline underline-offset-2",
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
