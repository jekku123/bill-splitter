import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/actions";
import { auth } from "@/lib/auth";
import { Cat } from "lucide-react";
import MainNav from "./main-nav";
import { ModeToggle } from "./mode-toggle";

export default async function Header() {
  const session = await auth();
  const userImage = session?.user.image as string;

  return (
    <header className="w-full flex-shrink-0">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold">Bill Splitter</h1>
        <MainNav />
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger>
              {session && (
                <Avatar>
                  <AvatarImage src={userImage} alt="user" />
                  <AvatarFallback>
                    <Cat />
                  </AvatarFallback>
                </Avatar>
              )}
            </DropdownMenuTrigger>

            <DropdownMenuContent className="mt-4">
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Groups</DropdownMenuItem>
              <DropdownMenuItem>Bills</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <form action={logout}>
                  <button type="submit">Logout</button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
