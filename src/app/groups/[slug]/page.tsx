import AddGroupMemberDialog from "@/components/add-group-member";
import BillsTable from "@/components/bills-table";
import AddBillDialog from "@/components/create-bill";
import GroupTotals from "@/components/group-totals";
import MembersCard from "@/components/members-card";
import { SettleUp } from "@/components/settle-up";
import { TypographyH1 } from "@/components/ui/typography";
import UserTotal from "@/components/user-total";
import { getGroup } from "@/drizzle/db";
import { auth } from "@/lib/auth/auth";
import { resolveMemberTotals } from "@/lib/utils";
import { notFound } from "next/navigation";

import { Suspense } from "react";

export default async function GroupPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await auth();
  const group = await getGroup(Number(params.slug));

  if (!group) {
    notFound();
  }

  const userMember = group.groupMembers.find(
    (member) => member.userId === Number(session?.user.id),
  );

  const userTotals = resolveMemberTotals(userMember!);

  const memberTotals = group.groupMembers.map(resolveMemberTotals);

  const groupTotal = memberTotals.reduce(
    (acc, memberTotal) => acc + memberTotal.totalPayments,
    0,
  );

  return (
    <div className="flex w-full flex-col items-center gap-10">
      <div className="flex w-full flex-col items-center justify-between gap-2 sm:flex-row">
        <TypographyH1>{group?.title}</TypographyH1>
        {/* <TypographyP>{group?.description}</TypographyP> */}
        <div className="flex items-center gap-4">
          <AddBillDialog group={group} />
          <AddGroupMemberDialog groupId={group.id} />
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MembersCard groupId={group.id} members={group.groupMembers} />
        <UserTotal userTotals={userTotals} />
        <GroupTotals total={groupTotal} />
        <Suspense fallback={<span>Loading...</span>}>
          <SettleUp group={group} />
        </Suspense>
      </div>
      <BillsTable group={group} />
    </div>
  );
}
