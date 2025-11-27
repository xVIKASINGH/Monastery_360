import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnnect";

// ------------------------------
// 🔥 Module Augmentation (Fix TS)
// ------------------------------
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "user" | "hotelier" | "monasteryAdmin";
      email: string;
      name: string;
    };
  }

  interface User {
    id: string;
    role: "user" | "hotelier" | "monasteryAdmin";
    email: string;
    name: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "user" | "hotelier" | "monasteryAdmin";
  }
}

// ------------------------------------
// 🔥 NEXTAUTH CONFIG
// ------------------------------------
const authOptions: NextAuthOptions = {
  providers: [
    // --------------------------
    // GOOGLE LOGIN
    // --------------------------
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // --------------------------
    // CREDENTIALS LOGIN
    // --------------------------
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email" },
        password: { label: "Password" },
      },

      async authorize(credentials): Promise<any> {
        await dbConnect();

        if (!credentials?.email || !credentials?.password)
          throw new Error("Missing email or password");

        const user = await User.findOne({ email: credentials.email });

        if (!user) throw new Error("User not found");

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isMatch) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
          role: user.type, // "user" | "hotelier" | "monasteryAdmin"
        };
      },
    }),
  ],

  // ------------------------------------
  // 🔥 TOKEN + SESSION HANDLING
  // ------------------------------------
  callbacks: {
    // Attach user role + id to JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },

    // Send role + id to session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
      }
      return session;
    },

    // ------------------------------------
    // 🔥 REDIRECT BASED ON ROLE
    // ------------------------------------
    async redirect({ url, baseUrl }) {
      // Custom redirect only for after login
      if (url === "/") return baseUrl;

      return url.startsWith("/") ? `${baseUrl}${url}` : url;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
