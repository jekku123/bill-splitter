import { GroupMembersWithRelatedData, MemberTotals } from "@/types/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-us", {
    day: "numeric",
    year: "numeric",
    month: "short",
  });
}

export function formatDateComplete(input: string, locale: string): string {
  const date = new Date(input);
  return date.toLocaleDateString(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: "UTC",
    timeZoneName: "short",
    hour12: false,
  });
}

export function reduceMemberTotals(
  member: GroupMembersWithRelatedData,
): MemberTotals {
  const memberTotal =
    member.payments.reduce((acc, payment) => acc + Number(payment.amount), 0) -
    member.shares.reduce((acc, share) => acc + Number(share.amount), 0);

  return {
    member,
    total: memberTotal,
  };
}
