import { CreateGroupDialog } from "@/components/create-group";
import { auth } from "@/lib/auth";
import { getUserGroups } from "@/lib/drizzle/data-access";
import GroupCard from "../../components/group-card";

export default async function GroupsPage() {
  const session = await auth();

  if (!session) {
    return null;
  }

  const groups = await getUserGroups(session.user.id as string);

  return (
    <div className="flex w-full flex-col items-center gap-10">
      <h1 className="text-7xl font-bold">Groups</h1>
      <CreateGroupDialog user={session.user} />

      {groups && (
        <ul className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </ul>
      )}

      {!groups && <p>No groups found</p>}
    </div>
  );
}
