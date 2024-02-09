import {
  getBillsByGroup,
  getGroupMembers,
  getPaymentsByBill,
  getPaymentsByGroupMember,
  getSharesByBill,
  getSharesByGroupMember,
} from "../../drizzle/data-access";
import { Bill, GroupMember, Payment, Share } from "../../drizzle/schema";

export interface SolvedDebt {
  debtor: GroupMember;
  creditor: GroupMember;
  amount: number;
}

export async function getSolvedDebts(groupId: number): Promise<SolvedDebt[]> {
  let payments: Payment[] = [];
  let shares: Share[] = [];
  let bills: Bill[] = [];
  let members: GroupMember[] = [];

  try {
    bills = await getBillsByGroup(groupId);
    members = await getGroupMembers(groupId);
    for (const bill of bills) {
      payments = payments.concat(await getPaymentsByBill(bill.id));
      shares = shares.concat(await getSharesByBill(bill.id));
    }
  } catch (error) {
    console.error("error", error);
  }

  const memberTotals = members.map((member) => {
    const memberPayments = payments.filter(
      (payment) => payment.payerId === member.id,
    );
    const memberShares = shares.filter(
      (share) => share.groupMemberId === member.id,
    );
    const memberTotal = memberPayments.reduce(
      (acc, payment) => acc + Number(payment.amount),
      0,
    );
    const memberShare = memberShares.reduce(
      (acc, share) => acc + Number(share.amount),
      0,
    );
    return {
      member,
      total: memberTotal - memberShare,
    };
  });

  const memberTotalsSorted = memberTotals.sort((a, b) => a.total - b.total);

  let solvedDebts = [];

  while (memberTotalsSorted.length > 1) {
    const debtor = memberTotalsSorted[0];
    const creditor = memberTotalsSorted[memberTotalsSorted.length - 1];

    const amount = Math.min(debtor.total, Math.abs(creditor.total));

    debtor.total -= amount;
    creditor.total += amount;

    solvedDebts.push({
      debtor: debtor.member,
      creditor: creditor.member,
      amount: Math.abs(amount),
    });

    if (debtor.total === 0) {
      memberTotalsSorted.shift();
    }

    if (creditor.total === 0) {
      memberTotalsSorted.pop();
    }
  }

  // REMOVE DEBTS WHERE AMOUNT IS 0
  const filteredSolvedDebts = solvedDebts.filter((debt) => debt.amount > 0);

  return filteredSolvedDebts;
}

export async function getGroupMemberDebt({
  groupMemberId,
}: {
  groupMemberId: number;
}) {
  try {
    const payments = await getPaymentsByGroupMember(groupMemberId);
    const shares = await getSharesByGroupMember(groupMemberId);

    const memberTotal =
      payments.reduce((acc, payment) => acc + Number(payment.amount), 0) -
      shares.reduce((acc, share) => acc + Number(share.amount), 0);

    return memberTotal;
  } catch (error) {
    console.error("error", error);
    return null;
  }
}
