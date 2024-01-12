import axios from "axios";
import { compare } from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "prisma/client";
// const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "me" },
        password: { label: "Password", type: "password", placeholder: "****" },
      },
      async authorize(credentials, req) {
        const user = await prisma.user.findUnique({
          where: {
            username: credentials.username,
          },
        });
        if (user && compare(credentials.password, user.password)) {
          return Promise.resolve(user);
        } else {
          return Promise.resolve(null);
        }
      },
    }),
  ],
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        if (token) {
            session.user = token.id;
          }
        // session.id = token.id;
      }
      // session.user.id = token.id;
      return session;
    },
  },
};
export default NextAuth(authOptions);
