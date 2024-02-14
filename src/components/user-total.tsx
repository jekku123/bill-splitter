import { MemberTotals } from "@/types/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function UserTotal({
  userTotals,
}: {
  userTotals: MemberTotals;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total</CardTitle>
        <CardDescription>How much have i spent?</CardDescription>
      </CardHeader>
      <CardContent>
        <ul>
          <li>Payments: {userTotals.totalPayments}</li>
          <li>Shares: {userTotals.totalShares}</li>
          <li>Credit: {userTotals.total}</li>
        </ul>
      </CardContent>
    </Card>
  );
}
