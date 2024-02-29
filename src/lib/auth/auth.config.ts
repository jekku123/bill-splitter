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
      const isLandingPage = request.nextUrl?.pathname === "/";

      // RESTRICTED PAGES FROM AUTHENTICATED USERS

      if (isOnLoginPage && user) {
        return Response.redirect(new URL("/", request.nextUrl));
      }

      if (isOnRegisterPage && user) {
        return Response.redirect(new URL("/", request.nextUrl));
      }

      // ALLOWED PAGES FOR UNAUTHENTICATED USERS

      if (isOnLoginPage || isOnRegisterPage) {
        return true;
      }

      if (isLandingPage) {
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
