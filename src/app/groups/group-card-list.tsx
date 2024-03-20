"use client";

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
import Link from "next/link";
import { useOptimistic } from "react";
import { toast } from "sonner";
import { RemoveActionDialog } from "../../components/remove-action-dialog";
import { Button } from "../../components/ui/button";
import { TypographyH3 } from "../../components/ui/typography";

type GroupCardListProps = {
  groups: GroupDataProps[];
};

export default function GroupCardList({ groups }: GroupCardListProps) {
  const [optimisticGroups, removeOptimisticGroup] = useOptimistic(
    groups,
    (state: GroupDataProps[], groupId: number) =>
      state.filter((group) => group.id !== groupId),
  );

  return (
    <ul className="mx-auto grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {optimisticGroups.map((group) => (
        <Card key={group.id} className="relative w-full">
          <CardHeader>
            <div className="flex w-full items-center justify-between gap-2">
              <CardTitle>{group.title}</CardTitle>
              <RemoveActionDialog
                title={`Delete group ${group.title}`}
                description="Are you sure? This action cannot be undone."
                action={async () => {
                  removeOptimisticGroup(group.id);
                  const removed = await removeGroupAction(group.id);
                  if (removed.success) {
                    toast.success(`
                      Group ${group.title} has been removed`);
                  } else {
                    toast.error(`
                      Could not remove group ${group.title}`);
                  }
                }}
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
          </CardContent>
          <CardFooter>
            <Button asChild className="mt-3 w-full">
              <Link href={`/groups/${group.id}`}>Manage group</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </ul>
  );
}
