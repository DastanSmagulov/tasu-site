import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email", type: "text" }, // Expect `identifier`
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { identifier, password } = credentials!;
        try {
          const res = await fetch("https://tasu.ziz.kz/api/v1/login/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: identifier, password }),
          });

          const data = await res.json();
          console.log(data);

          if (res.ok && data.access && data.refresh) {
            return {
              jwt: data.access,
              refreshToken: data.refresh,
            };
          } else {
            throw new Error(data.error?.message || "Authentication failed");
          }
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.jwt = token.jwt;
      session.refreshToken = token.refreshToken;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.jwt = user.jwt;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
