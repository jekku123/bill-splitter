import CreateGroupDialog from "@/components/create-group";
import { auth } from "@/lib/auth/auth";

import { TypographyH1, TypographyP } from "@/components/ui/typography";
import { getGroupsByUserId } from "@/drizzle/db";
import GroupCard from "../../components/group-card";

export default async function GroupsPage() {
  const session = await auth();

  if (!session) {
    return null;
  }

  const groups = await getGroupsByUserId(Number(session.user.id));

  return (
    <div className="flex w-full flex-col items-center gap-10">
      <TypographyH1 className="text-7xl font-bold">Groups</TypographyH1>
      <CreateGroupDialog user={session.user} />
      {groups ? (
        <ul className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </ul>
      ) : (
        <TypographyP>No groups found</TypographyP>
      )}
    </div>
  );
}
