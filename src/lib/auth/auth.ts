import { createDummyGroup } from "@/drizzle/create-dummy-group";
import Credentials from "@auth/core/providers/credentials";
import GitHub from "@auth/core/providers/github";
import { compare } from "bcrypt";
import NextAuth from "next-auth";
import { getUserByEmail, insertUser } from "../../drizzle/data-access";
import { env } from "../../env";
import { authConfig } from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  secret: env.NEXTAUTH_SECRET,
  providers: [
    GitHub({
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials, _req) {
        const user = await getUserByEmail(credentials?.email as string);

        if (!user) {
          return null;
        }

        const passwordCorrect = await compare(
          (credentials?.password as string) || "",
          user?.password,
        );

        if (passwordCorrect) {
          return {
            id: user.id.toString(),
            name: user.username,
            email: user.email,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        try {
          const isUser = await getUserByEmail(profile?.email!);

          if (!isUser) {
            const newUser = {
              id: Number(profile?.id),
              email: profile?.email ?? "",
              password: "github user",
            };

            await insertUser(newUser);
            await createDummyGroup(newUser.id);
          }
        } catch (err) {
          console.error(err);
          return false;
        }
      }
      return true;
    },
    ...authConfig.callbacks,
  },
});
