import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { GroupDataProps } from "@/drizzle/data-access";
import { removeGroupAction } from "@/lib/actions/group-actions";
import { X } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { TypographyH4, TypographyList } from "./ui/typography";

export default async function GroupCard({ group }: { group: GroupDataProps }) {
  return (
    <Card className="relative w-full">
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
        <TypographyH4>Members</TypographyH4>
        {group.groupMembers.length > 0 && (
          <TypographyList>
            {group.groupMembers.map((member) => (
              <li key={member.id}>{member.username}</li>
            ))}
          </TypographyList>
        )}
        <Button asChild className="mt-3 w-full">
          <Link href={`/groups/${group.id}`}>View group</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
