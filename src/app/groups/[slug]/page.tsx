import AddGroupMemberDialog from "@/app/groups/[slug]/add-group-member";
import BillsTable from "@/app/groups/[slug]/bills-table";
import CreateBillDialog from "@/app/groups/[slug]/create-bill-dialog";
import GroupTotals from "@/app/groups/[slug]/group-totals";
import MembersCard from "@/app/groups/[slug]/members-card";
import { SettleUp } from "@/app/groups/[slug]/settle-up";
import UserTotal from "@/app/groups/[slug]/user-total";
import { TypographyH1 } from "@/components/ui/typography";
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
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex w-full flex-col justify-between gap-4 sm:flex-row">
        <TypographyH1>{group?.title}</TypographyH1>
        <div className="flex items-center gap-4">
          <CreateBillDialog group={group} />
          <AddGroupMemberDialog groupId={group.id} />
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MembersCard members={group.groupMembers} />
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
