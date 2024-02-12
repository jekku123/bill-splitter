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
        <Button asChild className="w-full">
          <Link href={`/groups/${group.id}`}>View group</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
