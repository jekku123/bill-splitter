import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

export function AlertDialogDemo({ billId }: { billId: number }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="outline" className="rounded-full">
          <X className="h-5 w-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the bill.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="px-0">
            <form action={removeBill.bind(null, billId)}>
              <Button variant="ghost">Continue</Button>
            </form>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
