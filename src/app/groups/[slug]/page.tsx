import BillsTable from "@/components/bills-table";
import MembersCard from "@/components/members-card";
import { SettleUp } from "@/components/settle-up";
import { getBillsByGroup, getGroupData } from "@/drizzle/data-access";
import { Suspense } from "react";

export default async function GroupPage({
  params,
}: {
  params: { slug: string };
}) {
  // const group = await getGroupById(Number(params.slug));
  // const members = await getGroupMembers(Number(params.slug));

  const groupData = await getGroupData(Number(params.slug));
  const bills = await getBillsByGroup(Number(params.slug));

  // if (!group) {
  //   return null;
  // }

  return (
    <div className="flex w-full flex-col items-center gap-10">
      <h1 className="text-7xl font-bold">{groupData?.title}</h1>
      <p>{groupData?.description}</p>
      <div className="flex justify-center gap-4">
        <Suspense fallback={<span>Loading...</span>}>
          <SettleUp groupId={groupData.id} />
        </Suspense>
        <MembersCard groupId={groupData.id} members={groupData.groupMembers} />
      </div>
      <BillsTable bills={bills} />
    </div>
  );
}
