import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { GroupDataProps } from "@/drizzle/data-access";
import { removeGroupAction } from "@/lib/actions/group-actions";
import { X } from "lucide-react";
import Link from "next/link";
import AddGroupMemberDialog from "./add-group-member";
import AddBillDialog from "./create-bill";
import { Button } from "./ui/button";

export default async function GroupCard({ group }: { group: GroupDataProps }) {
  return (
    <Card className="relative w-full">
      <div className="flex h-full w-full flex-col justify-between">
        <div className="flex w-full flex-col gap-2">
          <CardHeader>
            <div className="flex w-full items-center justify-between gap-2">
              <CardTitle>{group.title}</CardTitle>
              <form action={removeGroupAction.bind(null, group.id)}>
                <Button size="icon" variant="outline" className="rounded-full">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Delete group</span>
                </Button>
              </form>
            </div>
            <CardDescription>{group.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex w-full items-center justify-between gap-2">
              <h2>Add Bill</h2>
              <AddBillDialog group={group} />
            </div>
            <div className="mt-2 flex w-full items-center justify-between gap-2">
              <h2>Members</h2>
              <AddGroupMemberDialog groupId={group.id} />
            </div>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              {group.groupMembers.map((member) => (
                <li key={member.id}>{member.username}</li>
              ))}
            </ul>
          </CardContent>
        </div>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href={`/groups/${group.id}`}>View group</Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
