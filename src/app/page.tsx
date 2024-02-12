import { Button } from "@/components/ui/button";
import { TypographyH1, TypographyLead } from "@/components/ui/typography";

import { auth } from "@/lib/auth/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  const userId = session?.user.id;

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <TypographyLead>Hello, {session && session.user.name}! ❤️</TypographyLead>
      <TypographyH1 className="text-center font-bold md:text-6xl lg:text-7xl">
        Welcome to Bill Splitter!
      </TypographyH1>
      <TypographyLead className="mx-auto max-w-lg text-center">
        Bill Splitter is a simple app to help you split the bills with your
        friends.
      </TypographyLead>
      <Button className="mt-2" asChild>
        <Link href="/groups">Go to Groups</Link>
      </Button>
    </div>
  );
}
