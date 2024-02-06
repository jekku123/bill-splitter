import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Group } from "@/lib/drizzle/schema";

import Link from "next/link";
import { Button } from "./ui/button";

export default function GroupCard({ group }: { group: Group }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{group.name}</CardTitle>
        <CardDescription>{group.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <h2>Members</h2>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>1st punes </li>
          <li>2nd jokes </li>
          <li>3rd one</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/groups/${group.id}`}>View group</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
