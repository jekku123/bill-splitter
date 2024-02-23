import { GroupMember } from "@/drizzle/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

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
        <ul className="ml-6 list-disc">
          {members.map((member) => (
            <li key={member.id}>{member.username}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
