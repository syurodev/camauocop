import NextAuth from "next-auth";

declare module "next/app" {
  interface Session {
    user: {
      _id: string,
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
    email?: string
    image?: string
    email_verified?: boolean
    picture?: string
  }
  interface Session {
    user: {
      address: string,
      shop_id: [any],
      email: string,
      phone: string,
      email_verified: boolean,
      phone_verified: boolean,
      image: string,
      provider: string,
      role: string,
      username: string,
      accessToken: string,
      _id: string,
      shopId?: string,
      shopStatus?: ShopStatus,
      shopType?: ShopType,
    }
  }
}