import { TypographyH1, TypographyP } from "@/components/ui/typography";
import { getGroupsByUserId } from "@/drizzle/db";
import { auth } from "@/lib/auth/auth";
import BillsTable from "./bills-table";

export default async function BillsPage() {
  const session = await auth();
  const groups = await getGroupsByUserId(Number(session?.user.id));

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <TypographyH1>Bills</TypographyH1>
      <TypographyP className="max-w-lg text-center">
        Here you can see all the bills from your groups. You can also filter by
        group, view the details of a bill, and remove a bill.
      </TypographyP>
      {groups ? <BillsTable groups={groups} /> : <p>No groups found</p>}
    </div>
  );
}
