import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bill } from "@/drizzle/schema";
import { formatDate } from "@/lib/utils";
import RemoveBill from "./ui/remove-bill";

export default function BillsTable({ bills }: { bills: Bill[] }) {
  return (
    <Table className="w-full">
      <TableCaption>List of bills</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bills.map((bill) => (
          <TableRow key={bill.id}>
            <TableCell className="font-medium">{bill.title}</TableCell>
            <TableCell>{bill.description}</TableCell>
            <TableCell>{formatDate(bill.createdAt)}</TableCell>
            <TableCell className="text-right">{bill.amount}</TableCell>
            <TableCell className="w-5">
              <RemoveBill billId={bill.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
