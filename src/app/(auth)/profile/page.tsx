import { TypographyH1, TypographyH3 } from "@/components/ui/typography";
import { getUserById } from "@/drizzle/data-access";
import { auth } from "@/lib/auth/auth";
import ProfileForm from "./form";

export default async function ProfilePage() {
  const session = await auth();
  const profile = await getUserById(Number(session!.user.id));

  if (!profile) {
    return <TypographyH3>Profile not found</TypographyH3>;
  }

  return (
    <div className="flex w-full flex-col items-center gap-9">
      <TypographyH1>Profile</TypographyH1>
      <ProfileForm user={profile} />
    </div>
  );
}
