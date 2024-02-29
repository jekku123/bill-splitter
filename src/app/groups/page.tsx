import CreateGroupDialog from "@/app/groups/create-group-form";
import { auth } from "@/lib/auth/auth";

import GroupCardList from "@/app/groups/group-card-list";
import { TypographyH1, TypographyP } from "@/components/ui/typography";
import { getGroupsByUserId } from "@/drizzle/db";

export default async function GroupsPage() {
  const session = await auth();

  if (!session) {
    return null;
  }

  const groups = await getGroupsByUserId(Number(session.user.id));

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <TypographyH1>Groups</TypographyH1>
      <TypographyP className="max-w-lg text-center">
        Here you can see all your groups. You can also create a new group.
      </TypographyP>
      <CreateGroupDialog user={session.user} />
      {groups ? <GroupCardList groups={groups} /> : <p>No groups found</p>}
    </div>
  );
}
