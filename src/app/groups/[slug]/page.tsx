import { getGroupById } from "@/lib/drizzle/data-access";

export default async function GroupPage({
  params,
}: {
  params: { slug: string };
}) {
  const group = await getGroupById(Number(params.slug));

  if (!group) {
    return null;
  }

  return (
    <div className="flex w-full flex-col items-center gap-10">
      <h1 className="text-7xl font-bold">{group.name}</h1>
      <p>{group.description}</p>
    </div>
  );
}
