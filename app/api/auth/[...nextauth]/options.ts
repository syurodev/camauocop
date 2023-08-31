import type { NextAuthOptions, Profile, Session, Account } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google"
import { connectToDB } from "@/lib/utils"
import User from "@/lib/models/users"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: {
          label: 'Username',
          type: 'text',
          placeholder: 'Username',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Password',
        }
      },
      async authorize(credentials) {
        //Lấy thông tin tài khoản từ database
        //doc: https://next-auth.js.org/configuration/providers/credentials
        // const user = { id: "21", username: "admin", password: "admin" };

        const res = await fetch(`${BASE_URL}/api/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          })
        })

        const user = await res.json();

        if (res.ok && user) {
          return user;
        } else {
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/login"
  },
  callbacks: {
    async signIn({ user, account, profile }): Promise<boolean> {
      if (account?.type === "oauth") {
        const res = await signInWithOAuth({ account, profile })
        return res
      }
      return true
    },

    async jwt({ token, user }) {
      const tokenData = await getUserByEmail({ email: token.email })
      token = tokenData
      return token
    },

    async session({ session, token }): Promise<Session> {
      session.user = token as any
      return session
    }
  }
}

async function signInWithOAuth({
  account, profile
}: {
  account: Account, profile: Profile | undefined
}): Promise<boolean> {
  await connectToDB()
  //user account adready -> login
  const userExistting = await User.findOne({ email: profile?.email })
  if (userExistting) {
    return true
  }

  //user not found -> register -> login
  try {
    const res = await fetch(`${BASE_URL}/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: profile?.name?.toLocaleLowerCase().replace(/\s/g, ''),
        email: profile?.email,
        email_verified: profile?.email_verified,
        password: "null",
        provider: account?.provider,
        image: profile?.picture
      })
    })

    return true
  } catch (error) {
    console.error("Error calling /api/users/register", error);
    return false
  }
}

async function getUserByEmail({ email }: { email: string | null | undefined }) {
  const user = await User.findOne({ email: email }).select("-password")

  if (!user) throw new Error("User not found")

  return { ...user._doc }
}