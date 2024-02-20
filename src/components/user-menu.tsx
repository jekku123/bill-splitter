import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/auth/actions";
import { UserRound } from "lucide-react";

import { User } from "next-auth";
import Link from "next/link";

export function UserMenu({ user }: { user: User | undefined }) {
  const userImage = user?.image as string;

  const userInitials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {user && (
          <Avatar>
            <AvatarImage src={userImage} alt="user" />
            <AvatarFallback>
              {userInitials ? userInitials : <UserRound />}
            </AvatarFallback>
          </Avatar>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {user?.name ? user.name : user?.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuSeparator />  */}
        <DropdownMenuItem>
          <Link href={`/profile`}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <form action={logout}>
            <button type="submit">Logout</button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
