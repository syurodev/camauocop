export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/products/product/:path*", "/users/order/"],
};