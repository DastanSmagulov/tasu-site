import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { decodeJwt } from "jose"; // Import for decoding JWTs

interface CustomUser {
  id: string;
  jwt: string;
  refreshToken: string;
  role: string; // Adding role here
}

declare module "next-auth" {
  interface User extends CustomUser {}

  interface Session {
    jwt: unknown;
    refreshToken: unknown;
    role: unknown; // Adding role here
  }

  interface JWT {
    jwt: string;
    refreshToken: string;
    role: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Missing credentials");
        }

        const { identifier, password } = credentials;

        try {
          const res = await fetch("https://tasu.ziz.kz/api/v1/login/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: identifier, password }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
              errorData?.error?.message || "Authentication failed"
            );
          }

          const data = await res.json();

          if (data.access && data.refresh) {
            const user: CustomUser = {
              id: data.userId,
              jwt: data.access,
              refreshToken: data.refresh,
              role: data.role,
            };
            return user;
          } else {
            throw new Error("Invalid credentials");
          }
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.jwt = user.jwt;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
      } else if (token.jwt) {
        const decoded = decodeJwt(token.jwt + "");
        token.role = (decoded.role as string) || token.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.jwt = token.jwt;
      session.refreshToken = token.refreshToken;
      session.role = token.role;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
