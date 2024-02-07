import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Group } from "@/lib/drizzle/schema";

import { removeGroup } from "@/lib/drizzle/actions/group";
import { getGroupMembers } from "@/lib/drizzle/data-access2";
import { X } from "lucide-react";
import Link from "next/link";
import AddGroupMemberDialog from "./add-group-member";
import { Button } from "./ui/button";

export default async function GroupCard({ group }: { group: Group }) {
  const members = await getGroupMembers(group.id);

  if (!members) {
    return null;
  }

  return (
    <Card className="relative w-full">
      <div className="flex h-full w-full flex-col justify-between">
        <div className="flex w-full flex-col gap-2">
          <CardHeader>
            <CardTitle>{group.title}</CardTitle>
            <CardDescription>{group.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex w-full items-center justify-between gap-2">
              <h2>Members</h2>
              <AddGroupMemberDialog groupId={group.id} />
            </div>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
              {members.map((member) => (
                <li key={member.id}>{member.username}</li>
              ))}
            </ul>
          </CardContent>
        </div>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href={`/groups/${group.id}`}>View group</Link>
          </Button>
          <form action={removeGroup.bind(null, group.id)}>
            <Button
              size="icon"
              variant="outline"
              className="absolute right-6 top-6 rounded-full"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Delete group</span>
            </Button>
          </form>
        </CardFooter>
      </div>
    </Card>
  );
}
