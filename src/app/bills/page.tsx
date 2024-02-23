import { TypographyH1 } from "@/components/ui/typography";
import { getGroupsByUserId } from "@/drizzle/db";
import { auth } from "@/lib/auth/auth";
import BillsTable from "./bills-table";

export default async function BillsPage() {
  const session = await auth();
  const groups = await getGroupsByUserId(Number(session?.user.id));

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <TypographyH1>Bills</TypographyH1>
      {groups ? <BillsTable groups={groups} /> : <p>No groups found</p>}
    </div>
  );
}
