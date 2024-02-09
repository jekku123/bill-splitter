import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function UserTotal({ total }: { total: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total</CardTitle>
        <CardDescription>Your total debt or credit</CardDescription>
      </CardHeader>
      <CardContent>
        <span>{total}</span>
      </CardContent>
    </Card>
  );
}
