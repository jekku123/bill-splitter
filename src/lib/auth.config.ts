import { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // @ts-ignore: This is a valid callback
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
    authorized({ auth, request }) {
      const user = auth?.user;
      const isOnLoginPage = request.nextUrl?.pathname.startsWith("/login");
      const isOnRegisterPage =
        request.nextUrl?.pathname.startsWith("/register");

      // ONLY UNAUTHENTICATED USERS CAN REACH THE REGISTER AND LOGIN PAGE

      if (isOnLoginPage && user) {
        return Response.redirect(new URL("/", request.nextUrl));
      }

      if (isOnRegisterPage && user) {
        return Response.redirect(new URL("/", request.nextUrl));
      }

      // ALLOW UNAUTHENTICATED USERS TO REACH THE REGISTER AND LOGIN PAGE

      if (isOnLoginPage || isOnRegisterPage) {
        return true;
      }

      // ONLY AUTHENTICATED USERS CAN REACH REST OF THE APPLICATION
      return !!user;
    },
  },
  session: {
    strategy: "jwt",
  },
  providers: [],
} satisfies NextAuthConfig;
