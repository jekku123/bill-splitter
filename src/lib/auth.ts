import Credentials from '@auth/core/providers/credentials';
import { compare } from 'bcrypt';
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { getUserByEmail } from './drizzle/data-access';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // GitHub({
    //   clientId: process.env.AUTH_GITHUB_ID,
    //   clientSecret: process.env.AUTH_GITHUB_SECRET,
    // }),
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
          (credentials?.password as string) || '',
          user?.password
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
    // async signIn({ user, account, profile }) {
    //   if (account?.provider === 'github') {
    //     try {
    //       const user = await getUserByEmail(profile?.email!);

    //       if (!user) {
    //         const newUser = {
    //           email: profile?.email!,
    //           password: 'github user',
    //         };

    //         await db.insert(users).values(newUser);
    //       }
    //     } catch (err) {
    //       console.log(err);
    //       return false;
    //     }
    //   }
    //   return true;
    // },
    ...authConfig.callbacks,
  },
});
