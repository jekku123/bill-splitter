import { db } from ".";
import { bills, groupMembers, groups, payments, shares } from "./schema";

export async function createDummyGroup(creatorId: number) {
  try {
    const group = await db
      .insert(groups)
      .values({
        creatorId,
        title: "Demo Group",
        description: "Demo description dolor sit",
      })
      .returning({
        id: groups.id,
      });

    if (!group) {
      throw new Error("Group not created");
    }

    const dummyMembersSchema = [
      {
        userId: creatorId,
        groupId: group[0].id,
        username: "You",
      },
      {
        groupId: group[0].id,
        username: "Jane Doe",
      },
      {
        groupId: group[0].id,
        username: "John Smith",
      },
    ];

    const dummyMembers = await db
      .insert(groupMembers)
      .values(dummyMembersSchema)
      .returning({
        id: groupMembers.id,
      });

    const dummyBillsSchema = [
      {
        title: "Demo bill 1",
        description: "Demo bill description dolor sit",
        groupId: group[0].id,
        amount: "400",
      },
      {
        title: "Demo bill 2",
        description: "Demo bill description dolor sit",
        groupId: group[0].id,
        amount: "300",
      },
      {
        title: "Demo bill 3",
        description: "Demo bill description dolor sit",
        groupId: group[0].id,
        amount: "200",
      },
    ];

    const dummyBills = await db
      .insert(bills)
      .values(dummyBillsSchema)
      .returning({
        id: bills.id,
      });

    const dummyPaymentsSchema = [
      {
        billId: dummyBills[0].id,
        payerId: dummyMembers[0].id,
        amount: "200",
      },
      {
        billId: dummyBills[0].id,
        payerId: dummyMembers[2].id,
        amount: "200",
      },
      {
        billId: dummyBills[1].id,
        payerId: dummyMembers[1].id,
        amount: "300",
      },
      {
        billId: dummyBills[2].id,
        payerId: dummyMembers[0].id,
        amount: "100",
      },
      {
        billId: dummyBills[2].id,
        payerId: dummyMembers[1].id,
        amount: "100",
      },
    ];

    await db.insert(payments).values(dummyPaymentsSchema);

    const dummySharesSchema = [
      {
        billId: dummyBills[0].id,
        groupMemberId: dummyMembers[0].id,
        amount: "150",
      },
      {
        billId: dummyBills[0].id,
        groupMemberId: dummyMembers[1].id,
        amount: "150",
      },
      {
        billId: dummyBills[0].id,
        groupMemberId: dummyMembers[2].id,
        amount: "100",
      },
      {
        billId: dummyBills[1].id,
        groupMemberId: dummyMembers[0].id,
        amount: "75",
      },
      {
        billId: dummyBills[1].id,
        groupMemberId: dummyMembers[1].id,
        amount: "100",
      },
      {
        billId: dummyBills[1].id,
        groupMemberId: dummyMembers[2].id,
        amount: "125",
      },
      {
        billId: dummyBills[2].id,
        groupMemberId: dummyMembers[1].id,
        amount: "125",
      },
      {
        billId: dummyBills[2].id,
        groupMemberId: dummyMembers[2].id,
        amount: "75",
      },
    ];

    await db.insert(shares).values(dummySharesSchema);

    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Could not create dummy group");
  }
}
