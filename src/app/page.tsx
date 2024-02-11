import { Button } from "@/components/ui/button";

import { auth } from "@/lib/auth/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  const userId = session?.user.id;

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6">
      <h1>Hello, {session && session.user.name}! ❤️</h1>
      <h2 className="text-7xl font-bold">Welcome to Bill Splitter</h2>
      {/* {session && <span>{session.user.name}!</span>} */}
      <p className="text-2xl">
        The app that helps you split bills with your friends
      </p>
      <Button asChild>
        <Link href="/groups">View groups</Link>
      </Button>
    </div>
  );
}
