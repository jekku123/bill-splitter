import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function GroupTotals({ total }: { total: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Group Totals</CardTitle>
        <CardDescription>Groups spendings so far</CardDescription>
      </CardHeader>
      <CardContent>{total}</CardContent>
    </Card>
  );
}
