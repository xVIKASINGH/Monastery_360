// File: /app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnnect";

/* ---------------------------------------------------------
   MODULE AUGMENTATION
--------------------------------------------------------- */
declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: "user" | "hotelier" | "monasteryAdmin";
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
    id?: string;
    role?: "user" | "hotelier" | "monasteryAdmin";
    email?: string | null;
    name?: string | null;
  }
}

/* ---------------------------------------------------------
   NEXTAUTH CONFIG
--------------------------------------------------------- */
export const authOptions: NextAuthOptions = {
  providers: [
    /* ---------------------------------------------------------
       GOOGLE PROVIDER — FIXED with profile()
    --------------------------------------------------------- */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        console.log("🌐 GOOGLE PROFILE:", profile);
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),

    /* ---------------------------------------------------------
       CREDENTIALS PROVIDER
    --------------------------------------------------------- */
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        console.log("📩 [CREDENTIALS] authorize:", credentials);

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        await dbConnect();
        console.log("🔗 Connected to DB");

        const user = await User.findOne({ email: credentials.email });
        console.log("🔍 User found:", user);

        if (!user) throw new Error("User not found");

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        console.log("🔐 Password match:", isMatch);

        if (!isMatch) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
          role: user.type,
        } as any;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  /* ---------------------------------------------------------
     CALLBACKS
  --------------------------------------------------------- */
  callbacks: {
    /* ---------------------------------------------------------
       signIn — Google user creation works HERE ONLY (in v5)
    --------------------------------------------------------- */
    async signIn({ user, account }) {
      console.log("\n================ SIGN-IN CALLBACK ================");
      console.log("🔹 user:", user);
      console.log("🔹 account:", account);

      if (account?.provider === "google") {
        console.log("🌐 Handling Google sign-in...");

        await dbConnect();

        const existing = await User.findOne({ email: user.email });
        console.log("🔍 Existing DB user:", existing);

        if (!existing) {
          console.log("🆕 Creating new Google user in DB...");

          const created = await User.create({
            email: user.email,
            username: user.name,
            password: "",
            type: "user",
          });

          console.log("✅ Google user created:", created);
        }
      }

      return true;
    },

    /* ---------------------------------------------------------
       JWT CALLBACK — attaches data to token
    --------------------------------------------------------- */
    async jwt({ token, user }) {
      console.log("\n================ JWT CALLBACK ================");
      console.log("🔹 token at start:", token);
      console.log("🔹 user:", user);

      if (user) {
        console.log("📦 Attaching user to token...");
        token.id = (user as any).id;
        token.role = (user as any).role ?? "user";
        token.email = (user as any).email;
        token.name = (user as any).name;
      }

      console.log("🏁 token final:", token);
      return token;
    },

    /* ---------------------------------------------------------
       SESSION CALLBACK
    --------------------------------------------------------- */
    async session({ session, token }) {
      console.log("\n================ SESSION CALLBACK ================");
      console.log("🔹 token:", token);

      if (session.user) {
        session.user.id = token.id!;
        session.user.role = token.role!;
        session.user.email = token.email!;
        session.user.name = token.name!;
      }

      console.log("🏁 session final:", session);
      return session;
    },

    /* ---------------------------------------------------------
       REDIRECT CALLBACK
    --------------------------------------------------------- */
    async redirect({ url, baseUrl }) {
      console.log("\n================ REDIRECT CALLBACK ================");
      console.log("➡ Redirecting to:", url);

      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return url;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
