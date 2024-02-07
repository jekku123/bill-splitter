import AddBillDialog from "@/components/create-bill";
import { getBillsByGroup, getGroupData } from "@/lib/drizzle/data-access2";

export default async function GroupPage({
  params,
}: {
  params: { slug: string };
}) {
  // const group = await getGroupById(Number(params.slug));
  // const members = await getGroupMembers(Number(params.slug));
  const bills = await getBillsByGroup(Number(params.slug));

  const groupData = await getGroupData(Number(params.slug));

  // if (!group) {
  //   return null;
  // }

  if (!groupData) {
    return null;
  }

  return (
    <div className="flex w-full flex-col items-center gap-10">
      <h1 className="text-7xl font-bold">{groupData.group?.title}</h1>

      <p>{groupData.group?.description}</p>
      <h2>Members</h2>
      {groupData.members.at(0) ? (
        <ul className="">
          {groupData.members.map((member) => (
            <li key={member.id}>{member.username}</li>
          ))}
        </ul>
      ) : (
        <span>No members</span>
      )}
      <div className="flex gap-4">
        <h2>Bills</h2>
        <AddBillDialog groupData={groupData} />
      </div>
      {bills.at(0) ? (
        <ul className="">
          {bills.map((bill) => (
            <li key={bill.id}>{bill.title}</li>
          ))}
        </ul>
      ) : (
        <span>No bills</span>
      )}
    </div>
  );
}
