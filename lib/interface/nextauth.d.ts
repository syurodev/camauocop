import NextAuth from "next-auth";

declare module "next/app" {
  interface Session {
    user: {
      _id: string,
      name: string,
      email: string,
      username: string,
      role: string
      accessToken: string,
    }
  }
}


declare module "next-auth" {

  interface Profile {
    sub?: string
    name?: string
    email?: string
    image?: string
    email_verified?: boolean
    picture?: string
  }
  interface Session {
    user: {
      address: string,
      email: string,
      email_verified: boolean,
      image: string,
      provider: string,
      role: string,
      username: string,
      accessToken: string,
      name: string,
      _id: string,
    }
  }
}