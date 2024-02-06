import Credentials from "@auth/core/providers/credentials";
import GitHub from "@auth/core/providers/github";
import { compare } from "bcrypt";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { createUser, getUserByEmail } from "./drizzle/data-access";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
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
              email: profile?.email!,
              password: "github user",
            };

            await createUser(newUser);
          }
        } catch (err) {
          console.log(err);
          return false;
        }
      }
      return true;
    },
    ...authConfig.callbacks,
  },
});
