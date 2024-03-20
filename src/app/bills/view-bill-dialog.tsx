"use client";

import { GroupDataProps } from "@/drizzle/data-access";

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

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateComplete } from "@/lib/utils";
import { BillType } from "@/types/types";
import { EyeIcon } from "lucide-react";

export function ViewBillDialog({
  bill,
  group,
}: {
  bill: BillType;
  group: GroupDataProps;
}) {
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
          <DialogDescription className="underline">
            {formatDateComplete(bill.createdAt)}
          </DialogDescription>
          <DialogDescription className="pt-1">
            {bill.description}
          </DialogDescription>
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
