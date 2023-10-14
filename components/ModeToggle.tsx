"use client";

import * as React from "react";
import { LuMoon, LuSunMedium } from "react-icons/lu"
import { useTheme } from "next-themes";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

export function ModeToggle({ className = "" }: { className?: string }) {
  const { setTheme } = useTheme();

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="ghost"
          isIconOnly
          className={`${className} border-none`}
          radius="full"
        >
          <LuSunMedium className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <LuMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onClick={() => setTheme("light")}>Chế độ sáng</DropdownItem>
        <DropdownItem onClick={() => setTheme("dark")}>Chế độ tối</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
