import { Bill, Group, GroupMember, Payment, Share } from "../drizzle/schema";

export interface BillWithRelatedData extends Bill {
  payments: Payment[];
  shares: Share[];
}

export interface GroupMembersWithRelatedData extends GroupMember {
  payments: Payment[];
  shares: Share[];
}

export interface GroupDataType extends Group {
  groupMembers: GroupMembersWithRelatedData[];
  bills: BillWithRelatedData[];
}

export interface Debt {
  debtor: GroupMember;
  creditor: GroupMember;
  amount: number;
}

export interface MemberTotals {
  member: GroupMembersWithRelatedData;
  total: number;
}
