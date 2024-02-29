import { Button } from "@/components/ui/button";
import { TypographyH1, TypographyLead } from "@/components/ui/typography";

import { auth } from "@/lib/auth/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      {session && (
        <TypographyLead>
          Hello!, {session.user.name ? session.user.name : session?.user.email}{" "}
          ❤️
        </TypographyLead>
      )}
      <TypographyH1 className="text-center font-bold md:text-6xl lg:text-7xl">
        Welcome to Bill Splitter
      </TypographyH1>
      <TypographyLead className="mx-auto max-w-lg text-center">
        {session
          ? `
        You can now start splitting bills with your friends and family.
        `
          : `
          Bill Splitter is a simple app to help you split the bills with your
          friends.
        `}
      </TypographyLead>
      {session ? (
        <Button className="mt-2" asChild>
          <Link href="/groups">Go to Groups</Link>
        </Button>
      ) : (
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/register">Register</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
