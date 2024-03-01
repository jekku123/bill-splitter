"use client";

import { ViewBillDialog } from "@/app/bills/view-bill-dialog";
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
import { removeBill } from "@/lib/actions/bill-actions";
import { formatDate } from "@/lib/utils";
import { BillType } from "@/types/types";
import { useOptimistic } from "react";
import { RemoveActionDialog } from "../../../components/remove-action-dialog";

export default function BillsTable({ group }: { group: GroupDataProps }) {
  const [optimisticBills, handleOptimisticBills] = useOptimistic(
    group.bills,
    (state: BillType[], billId: number) =>
      state.filter((bill) => bill.id !== billId),
  );

  return (
    <div className="w-full rounded-md border pb-4">
      <Table>
        <TableCaption>List of bills</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Paid by</TableHead>
            <TableHead>Participants</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-5" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {optimisticBills.map((bill) => (
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

              <TableCell className="">
                <div className="flex items-center gap-4">
                  <ViewBillDialog bill={bill} group={group} />
                  <RemoveActionDialog
                    title={`Delete bill ${bill.title}`}
                    description="Are you sure? This action cannot be undone."
                    action={async () => {
                      handleOptimisticBills(bill.id);
                      console.log("optimistically removed bill", bill.id);
                      await removeBill(bill.id);
                    }}
                  />
                  ;
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
