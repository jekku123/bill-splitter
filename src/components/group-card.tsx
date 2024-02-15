import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { GroupDataProps } from "@/drizzle/data-access";
import { removeGroupAction } from "@/lib/actions/group-actions";
import Link from "next/link";

import { RemoveActionDialog } from "./remove-action-dialog";
import { Button } from "./ui/button";
import { TypographyH3 } from "./ui/typography";

export default async function GroupCard({ group }: { group: GroupDataProps }) {
  return (
    <Card className="relative w-full">
      <CardHeader>
        <div className="flex w-full items-center justify-between gap-2">
          <CardTitle>{group.title}</CardTitle>
          <RemoveActionDialog
            title="Delete group"
            description="Are you sure? This action cannot be undone."
            action={removeGroupAction.bind(null, group.id)}
          />
        </div>
        <CardDescription>{group.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <TypographyH3 className="text-md">Members</TypographyH3>
        {group.groupMembers.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
            {group.groupMembers.map((member) => member.username).join(", ")}
          </div>
        )}
        <Button asChild className="mt-3 w-full">
          <Link href={`/groups/${group.id}`}>View group</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
