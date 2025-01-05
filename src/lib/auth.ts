import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { decodeJwt } from "jose";

interface CustomUser {
  id: string;
  jwt: string;
  refreshToken: string;
  role: string;
}

declare module "next-auth" {
  interface User extends CustomUser {}

  interface Session {
    jwt: string;
    refreshToken: string;
    role: string;
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
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

        try {
          const response = await axios.post(`${API_BASE_URL}/login/`, {
            email: identifier,
            password,
          });

          const data = response.data;

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

          if (axios.isAxiosError(error)) {
            const errorMessage =
              error.response?.data?.error?.message || "Authentication failed";
            throw new Error(errorMessage);
          }

          throw new Error("Authentication failed");
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
      session.jwt = token.jwt as string;
      session.refreshToken = token.refreshToken as string;
      session.role = token.role as string;
      return session;
    },
  },
};
