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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BillType } from "@/types/types";
import { EyeIcon } from "lucide-react";

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
              <TableHead className="w-[100px]">Group</TableHead>
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
                        <ViewBill bill={bill} group={group} />
                        <RemoveActionDialog
                          title="Are you absolutely sure?"
                          description={`This action cannot be undone.`}
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

function ViewBill({ bill, group }: { bill: BillType; group: GroupDataProps }) {
  const [open, setOpen] = useState(false);

  const payments = group.groupMembers
    .filter((member) => {
      return member.payments.some(
        (payment) =>
          payment.billId === bill.id && payment.payerId === member.id,
      );
    })
    .map((member) => {
      return {
        id: member.id,
        name: member.username,
        amount: member.payments
          .filter((payment) => payment.billId === bill.id)
          .reduce((acc, payment) => acc + Number(payment.amount), 0),
      };
    });

  const shares = group.groupMembers
    .filter((member) => {
      return member.shares.some(
        (share) =>
          share.billId === bill.id && share.groupMemberId === member.id,
      );
    })
    .map((member) => {
      return {
        id: member.id,
        name: member.username,
        amount: member.shares
          .filter((share) => share.billId === bill.id)
          .reduce((acc, share) => acc + Number(share.amount), 0),
      };
    });

  const credits = shares.map((share) => {
    return {
      name: share.name,
      amount:
        (payments.find((payment) => payment.id === share.id)?.amount ?? 0) -
        share.amount,
    };
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        <DialogTrigger asChild>
          <Button size="icon" variant="outline" className="rounded-full">
            <EyeIcon />
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{bill.title}</DialogTitle>
          <DialogDescription>{bill.description}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {payments.map((payment) => (
                  <li key={payment.name}>
                    {payment.name}: {payment.amount}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Shares</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {shares.map((share) => (
                  <li key={share.name}>
                    {share.name}: {share.amount}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {credits.map((credit) => (
                  <li key={credit.name}>
                    {credit.name}: {credit.amount}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Total</CardTitle>
            </CardHeader>
            <CardContent>{bill.amount}</CardContent>
          </Card>
        </div>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
