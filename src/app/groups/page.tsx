import CreateGroupDialog from "@/app/groups/create-group-form";
import { auth } from "@/lib/auth/auth";

import GroupCardList from "@/app/groups/group-card-list";
import { TypographyH1 } from "@/components/ui/typography";
import { getGroupsByUserId } from "@/drizzle/db";

export default async function GroupsPage() {
  const session = await auth();

  if (!session) {
    return null;
  }

  const groups = await getGroupsByUserId(Number(session.user.id));

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex w-full flex-col justify-between gap-4 sm:flex-row">
        <TypographyH1>Groups</TypographyH1>
        <div className="flex items-center gap-4">
          <CreateGroupDialog user={session.user} />
        </div>
      </div>
      {groups ? <GroupCardList groups={groups} /> : <p>No groups found</p>}
    </div>
  );
}
