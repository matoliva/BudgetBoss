import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  debug: true,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',  // Use JWT strategy
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ? parseInt(user.id, 10) : null; // Ensure the user ID is an integer
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) { // Check if session.user is defined
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        session.user.id = token.id; // Pass the user ID to the session
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
