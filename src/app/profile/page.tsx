import { auth } from "@/lib/auth/auth";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex w-full flex-col items-center justify-center">
      {user && (
        <div>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
          {user.image && (
            <Image
              src={user.image}
              alt="User profile image"
              width={200}
              height={200}
              priority
            />
          )}
        </div>
      )}
    </div>
  );
}
