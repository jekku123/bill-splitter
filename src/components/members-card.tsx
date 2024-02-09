import { GroupMember } from "@/drizzle/schema";
import AddGroupMemberDialog from "./add-group-member";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function MembersCard({
  groupId,
  members,
}: {
  groupId: number;
  members: GroupMember[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardDescription>Group members!</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="ml-6 list-disc [&>li]:mt-2">
          {members.map((member) => (
            <li key={member.id}>{member.username}</li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <AddGroupMemberDialog groupId={groupId} />
      </CardFooter>
    </Card>
  );
}
