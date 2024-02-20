import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GroupDataProps } from "@/drizzle/data-access";
import { getSettleUp } from "@/lib/debts-algorithm";
import { ArrowRight } from "lucide-react";

export async function SettleUp({ group }: { group: GroupDataProps }) {
  const debts = getSettleUp(group);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settle Up</CardTitle>
        <CardDescription>Offerer solution</CardDescription>
      </CardHeader>
      <CardContent>
        <ul>
          {debts?.at(0) ? (
            debts.map((debt, idx) => (
              <li key={idx} className="flex flex-wrap gap-2">
                <span>{debt.debtor.username}</span>
                <ArrowRight />
                <span>{debt.creditor.username}</span>
                <span> {debt.amount} </span>
              </li>
            ))
          ) : (
            <span>No debts</span>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
