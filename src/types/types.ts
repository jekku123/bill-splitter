import { Bill, GroupMember, Payment, Share } from "../drizzle/schema";

export interface BillType extends Bill {
  payments: Payment[];
  shares: Share[];
}

export interface Debt {
  debtor: GroupMember;
  creditor: GroupMember;
  amount: number;
}

export interface MemberTotal {
  member: GroupMemberType;
  total: number;
}

export interface MemberTotals {
  total: number;
  totalPayments: number;
  totalShares: number;
}

export interface GroupMemberType extends GroupMember {
  payments: Payment[];
  shares: Share[];
}
