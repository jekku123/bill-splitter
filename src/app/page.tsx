import { Button } from "@/components/ui/button";
import {
  TypographyH1,
  TypographyLead,
  TypographyP,
} from "@/components/ui/typography";

import { auth } from "@/lib/auth/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      {session ? (
        <TypographyLead>
          Hello!, {session.user.name ? session.user.name : session?.user.email}{" "}
          ❤️
        </TypographyLead>
      ) : (
        <TypographyLead>Hello, Stranger! ❤️</TypographyLead>
      )}
      <TypographyH1 className="text-center font-bold md:text-6xl lg:text-7xl">
        Welcome to Bill Splitter
      </TypographyH1>
      <TypographyP className="mx-auto max-w-lg text-center text-xl">
        {session
          ? `
        You can now start splitting bills with your friends and family.
        `
          : `
          Bill Splitter is a simple app to help you split the bills with your
          friends and family.
        `}
      </TypographyP>
      {session ? (
        <div className="mt-2 flex gap-4">
          <Button asChild>
            <Link href="/groups">Groups</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/bills">Bills</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-2 flex gap-4">
          <Button asChild>
            <Link href="/register">Register</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
