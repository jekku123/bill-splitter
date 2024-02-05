import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  return (
    <div className="flex grow flex-col items-center justify-center gap-6">
      <h1 className="text-7xl font-bold">Welcome to Bill Splitter</h1>
      {/* {session && <span>{session.user.name}!</span>} */}
      <p className="text-2xl">
        The app that helps you split bills with your friends
      </p>
      <Button>Create group</Button>
    </div>
  );
}
