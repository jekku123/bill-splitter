import { removeBill } from "@/lib/actions/bill-actions";
import { X } from "lucide-react";
import { Button } from "./button";

export default function RemoveBill({ billId }: { billId: number }) {
  return (
    <form action={removeBill.bind(null, billId)}>
      <Button size="icon" variant="outline" className="rounded-full">
        <X className="h-5 w-5" />
        <span className="sr-only">Delete bill</span>
      </Button>
    </form>
  );
}
