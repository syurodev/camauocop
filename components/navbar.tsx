"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/ModeToggle";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Tooltip,
  Button,
} from "@nextui-org/react";
import Link from "next/link";
import {
  AiOutlineShoppingCart,
  AiOutlinePlus,
  AiOutlineBell,
} from "react-icons/ai";
import UserMenu from "./elements/UserMenu";

const NavbarComponent: React.FC = () => {
  const [notification, setNotification] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <Navbar maxWidth="2xl">
      <NavbarBrand className="flex items-center h-full gap-5">
        <Link href={"/"} className="font-bold">
          SeaMarketHub
        </Link>
      </NavbarBrand>

      <NavbarContent justify="end" className="flex items-center gap-5">
        <ModeToggle className="!hidden lg:!flex" />

        <Tooltip content="Thông báo">
          <Button
            variant={"ghost"}
            isIconOnly
            radius="full"
            className="p-2 border-none"
          >
            <AiOutlineBell className="text-xl" />
          </Button>
        </Tooltip>

        <div className="flex items-center h-full gap-5">
          {session?.user ? (
            <>
              {/* Giỏ hàng */}
              <Tooltip content="Giỏ hàng">
                <Button
                  variant={"ghost"}
                  isIconOnly
                  radius="full"
                  className="p-2 border-none text-xl"
                >
                  <AiOutlineShoppingCart />
                </Button>
              </Tooltip>
              {/* Thêm hàng */}
              {session?.user?.role !== "individual" && (
                <Tooltip content="Thêm hàng">
                  <Button
                    variant={"ghost"}
                    isIconOnly
                    radius="full"
                    onClick={() => router.push("/products/product/add")}
                    className="p-2 border-none"
                  >
                    <AiOutlinePlus className="text-xl" />
                  </Button>
                </Tooltip>
              )}

              <UserMenu session={session} />
            </>
          ) : (
            <Button onClick={() => router.push("/login")}>Đăng nhập</Button>
          )}
        </div>
      </NavbarContent>
    </Navbar>
  );
};

export default NavbarComponent;
