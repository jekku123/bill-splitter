import BillsTable from "@/components/bills-table";
import AddBillDialog from "@/components/create-bill";
import MembersCard from "@/components/members-card";
import { SettleUp } from "@/components/settle-up";
import { getGroup } from "@/drizzle/db";
import { notFound } from "next/navigation";

import { Suspense } from "react";

export default async function GroupPage({
  params,
}: {
  params: { slug: string };
}) {
  const group = await getGroup(Number(params.slug));

  if (!group) {
    notFound();
  }

  return (
    <div className="flex w-full flex-col items-center gap-10">
      <h1 className="text-7xl font-bold">{group?.title}</h1>
      <p>{group?.description}</p>
      <div className="flex justify-center gap-4">
        <AddBillDialog group={group} />
        <Suspense fallback={<span>Loading...</span>}>
          <SettleUp groupId={group.id} />
        </Suspense>
        <MembersCard groupId={group.id} members={group.groupMembers} />
      </div>
      <BillsTable bills={group.bills} />
    </div>
  );
}
