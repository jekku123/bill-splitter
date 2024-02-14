import { auth } from "@/lib/auth/auth";
import Link from "next/link";
import { MobileMenu } from "./mobile-menu";
import { ModeToggle } from "./mode-toggle";
import { TypographyH3 } from "./ui/typography";
import { UserMenu } from "./user-menu";

export default async function Header() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="w-full flex-shrink-0">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex w-1/3 items-center">
          <MobileMenu className="z-50 flex sm:hidden" />
          <TypographyH3 className="hidden text-2xl font-bold sm:flex">
            Bill Splitter
          </TypographyH3>
        </div>
        <Nav />

        <div className="flex w-1/3 items-center justify-end space-x-4">
          <UserMenu user={user} />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

function Nav() {
  return (
    <nav className="hidden w-1/3 flex-shrink-0 justify-center md:flex ">
      <ul className="flex gap-4">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/groups">Groups</Link>
        </li>
      </ul>
    </nav>
  );
}
