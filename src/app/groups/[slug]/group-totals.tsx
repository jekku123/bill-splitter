import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

export default function GroupTotals({ total }: { total: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Group Totals</CardTitle>
        <CardDescription>Groups spendings so far</CardDescription>
      </CardHeader>
      <CardContent>
        {total === 0 ? <span>No spendings</span> : <span>{total}</span>}
      </CardContent>
    </Card>
  );
}
