import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSolvedDebts } from "@/lib/actions/debts";
import { ArrowRight } from "lucide-react";

export async function SettleUp({ groupId }: { groupId: number }) {
  const debts = await getSolvedDebts(groupId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settle Up</CardTitle>
        <CardDescription>Offerer solution</CardDescription>
      </CardHeader>
      <CardContent>
        <ul>
          {debts.at(0) ? (
            debts.map((debt, idx) => (
              <li key={idx} className="flex gap-2">
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
