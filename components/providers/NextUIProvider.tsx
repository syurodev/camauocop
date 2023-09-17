"use client";

import { NextUIProvider } from "@nextui-org/react";

export function NextProviders({ children }: { children: React.ReactNode }) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
