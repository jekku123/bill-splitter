"use client";

import { RemoveActionDialog } from "@/components/remove-action-dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GroupDataProps } from "@/drizzle/data-access";
import { removeBill } from "@/lib/actions/bill-actions";
import { formatDate } from "@/lib/utils";

import { useState } from "react";

import { ViewBillDialog } from "@/app/bills/view-bill-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BillsTable({ groups }: { groups: GroupDataProps[] }) {
  const [selectedGroup, setSelectedGroup] = useState<string>("all");

  const handleGroupSelect = (value: string) => {
    setSelectedGroup(value);
  };

  const filteredGroups =
    selectedGroup === "all"
      ? groups
      : groups.filter((group) => group.title === selectedGroup);

  const total = filteredGroups.reduce(
    (acc, group) =>
      acc +
      Number(group.bills.reduce((acc, bill) => acc + Number(bill.amount), 0)),
    0,
  );

  return (
    <div className="w-full">
      <div className="flex items-center gap-4">
        <Select onValueChange={handleGroupSelect}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Choose group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {groups.map((group) => (
              <SelectItem key={group.id} value={group.title}>
                {group.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-3 w-full rounded-md border pb-4">
        <Table>
          <TableCaption>List of bills</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Group</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Paid by</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-5"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroups.map((group) => {
              return group.bills.map((bill) => {
                return (
                  <TableRow key={bill.id}>
                    <TableCell className="font-medium">{group.title}</TableCell>
                    <TableCell>{bill.title}</TableCell>
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
                          title={`Delete bill ${bill.title}?`}
                          description={`Are you sure? This action cannot be undone.`}
                          action={removeBill.bind(null, bill.id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              });
            })}
          </TableBody>
          <TableFooter className="bg-background">
            <TableRow>
              <TableCell colSpan={5}>Total</TableCell>
              <TableCell className="text-right">{total}</TableCell>
              <TableCell className="w-5"></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
