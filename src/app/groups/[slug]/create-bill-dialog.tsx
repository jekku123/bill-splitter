"use client";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

import { GroupDataProps } from "@/drizzle/data-access";
import { Plus } from "lucide-react";
import { Separator } from "../../../components/ui/separator";
import { CreateBillForm } from "./create-bill-form";

export default function CreateBillDialog({ group }: { group: GroupDataProps }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        <span className="">Add Bill</span>
        <DialogTrigger asChild>
          <Button size="icon" variant="outline" className="rounded-full">
            <Plus />
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Bill</DialogTitle>
          <DialogDescription>
            Add a bill to group {group?.title}
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <CreateBillForm group={group} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
