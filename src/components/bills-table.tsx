import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GroupDataProps } from "@/drizzle/data-access";
import { formatDate } from "@/lib/utils";
import { AlertDialogDemo } from "./ui/remove-bill";

export default function BillsTable({ group }: { group: GroupDataProps }) {
  return (
    <div className="w-full rounded-md border pb-4">
      <Table>
        <TableCaption>List of bills</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Paid by</TableHead>
            <TableHead>Participants</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {group.bills.map((bill) => (
            <TableRow key={bill.id}>
              <TableCell className="font-medium">{bill.title}</TableCell>
              <TableCell>{bill.description}</TableCell>
              <TableCell>{formatDate(bill.createdAt)}</TableCell>
              <TableCell>
                {group.groupMembers
                  .filter((member) =>
                    member.payments.some(
                      (payment) =>
                        payment.billId === bill.id &&
                        payment.payerId === member.id,
                    ),
                  )
                  .map((member) => member.username)
                  .join(", ")}
              </TableCell>
              <TableCell>
                {group.groupMembers
                  .filter((member) =>
                    member.shares.some(
                      (share) =>
                        share.billId === bill.id &&
                        share.groupMemberId === member.id,
                    ),
                  )
                  .map((member) => member.username)
                  .join(", ")}
              </TableCell>
              <TableCell className="text-right">{bill.amount}</TableCell>
              <TableCell className="w-5">
                <AlertDialogDemo billId={bill.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
