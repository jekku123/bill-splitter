import CreateGroupDialog from "@/components/create-group-form";
import { auth } from "@/lib/auth/auth";

import GroupCardList from "@/components/group-card-list";
import { TypographyH1 } from "@/components/ui/typography";
import { getGroupsByUserId } from "@/drizzle/db";

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
      {groups ? <GroupCardList groups={groups} /> : <p>No groups found</p>}
    </div>
  );
}
