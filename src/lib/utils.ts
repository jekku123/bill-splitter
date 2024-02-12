import { GroupDataProps } from "@/drizzle/data-access";
import { MemberTotal, MemberTotals } from "@/types/types";
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
  member: GroupDataProps["groupMembers"][0],
): MemberTotal {
  const memberPayments = member.payments.reduce(
    (acc, payment) => acc + Number(payment.amount),
    0,
  );
  const memberShares = member.shares.reduce(
    (acc, share) => acc + Number(share.amount),
    0,
  );
  const memberTotal = memberPayments - memberShares;

  return {
    member,
    total: memberTotal,
  };
}

export function resolveMemberTotals(
  member: GroupDataProps["groupMembers"][0],
): MemberTotals {
  const memberPayments = member.payments.reduce(
    (acc, payment) => acc + Number(payment.amount),
    0,
  );
  const memberShares = member.shares.reduce(
    (acc, share) => acc + Number(share.amount),
    0,
  );
  const memberTotal = memberPayments - memberShares;

  return {
    total: memberTotal,
    totalPayments: memberPayments,
    totalShares: memberShares,
  };
}

// export function resolveGroupTotalSum(members: MemberTotals[]): number {
//   return members.reduce((acc, member) => acc + member.total, 0);
// }

// export function formatGroupDataResponse(groupData: GroupData) {
//   const groupMembers = groupData.groupMembers.map((member) =>
//     resolveMemberTotals(member),
//   );
//   const total = resolveGroupTotalSum(groupMembers);

//   return {
//     ...groupData,
//     groupMembers: groupMembers,
//     total,
//   };
// }
