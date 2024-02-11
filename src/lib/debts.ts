import { Debt } from "@/types/types";
import { getMemberTotals } from "../drizzle/data-access";

export async function getSettleUp(groupId: number): Promise<Debt[] | null> {
  try {
    const memberTotals = await getMemberTotals(groupId);
    const memberTotalsSorted = memberTotals.sort((a, b) => a.total - b.total);

    let solvedDebts = [];

    while (memberTotalsSorted.length > 1) {
      const debtor = memberTotalsSorted[0];
      const creditor = memberTotalsSorted[memberTotalsSorted.length - 1];

      const amount = Math.min(Math.abs(debtor.total), Math.abs(creditor.total));

      if (amount === 0) {
        break;
      }

      debtor.total += amount;
      creditor.total -= amount;

      solvedDebts.push({
        debtor: debtor.member,
        creditor: creditor.member,
        amount: amount,
      });

      if (debtor.total === 0) {
        memberTotalsSorted.shift();
      }

      if (creditor.total === 0) {
        memberTotalsSorted.pop();
      }
    }
    return solvedDebts;
  } catch (error) {
    console.error("error", error);
    return null;
  }
}
