"use client";

import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";

// import SigninButton from './elements/SigninButton';
import { Button } from "./ui/button";
// import NavTab from './elements/NavTab';
// import TippyPopup from './elements/TippyPopup';
import SearchBox from "./elements/SearchBox";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import {
  AiOutlineShoppingCart,
  AiOutlinePlus,
  AiOutlineUser,
  AiOutlineLogout,
  AiOutlineBell,
} from "react-icons/ai";

const Navbar: React.FC = () => {
  const [topOfPage, setTopOfPage] = useState(true);
  const [notification, setNotification] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();

  const handleScroll = () => {
    setTopOfPage(window.scrollY <= 50);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`sticky h-[60px] top-0 z-50 w-full backdrop-blur-xl flex-none 
      transition-colors duration-150 ${
        topOfPage ? "" : "shadow-md"
      } lg:z-50 lg:border-b lg:border-slate-900/10
       dark:border-slate-50/[0.06] supports-backdrop-blur:bg-white/95 
       dark:bg-transparent`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex px-2 max-w-[90rem] h-full mx-auto justify-between items-center">
        <div className="flex items-center h-full gap-5">
          <Link href={"/"}>SeaMarketHub</Link>
          {/* <NavTab /> */}
        </div>

        <div className="flex items-center gap-5">
          <SearchBox />
          <ModeToggle />

          <Button variant={"ghost"} size={"icon"} className="p-2 rounded-full">
            <AiOutlineBell className="text-xl" />
          </Button>

          <div className="hidden lg:!flex items-center h-full gap-5">
            {session?.user ? (
              <>
                {/* Giỏ hàng */}
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="p-2 rounded-full text-xl"
                >
                  <AiOutlineShoppingCart />
                </Button>

                {/* Thêm hàng */}
                {session?.user?.role !== "individual" && (
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    onClick={() => router.push("/products/product/add")}
                    className="p-2 rounded-full"
                  >
                    <AiOutlinePlus className="text-xl" />
                  </Button>
                )}

                <Popover>
                  <PopoverTrigger>
                    <Image
                      className="object-cover rounded-full"
                      src={session?.user.image || "/images/avatarDefault.png"}
                      alt="avatar"
                      height={40}
                      width={40}
                      priority
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <div>
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        className="w-full !justify-start"
                      >
                        <AiOutlineUser className="text-xl" />
                        <span className="ml-2">Thông tin tài khoản</span>
                      </Button>
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        className="w-full !justify-start"
                        onClick={() => signOut()}
                      >
                        <AiOutlineLogout className="text-xl" />
                        <span className="ml-2">Đăng xuất</span>
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </>
            ) : (
              <Button onClick={() => router.push("/login")} variant={"default"}>
                Đăng nhập
              </Button>
            )}
          </div>

          {/* MOBILE */}
          <div className="flex lg:!hidden items-center h-full gap-5">
            {session?.user ? (
              <Popover>
                <PopoverTrigger>
                  <Image
                    className="object-cover rounded-full"
                    src={session?.user.image || "/images/avatarDefault.png"}
                    alt="avatar"
                    height={40}
                    width={40}
                    priority
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <div className="flex flex-col gap-3 px-4">
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      className="w-full mt-3 p-2 !justify-start"
                    >
                      <AiOutlineUser className="text-xl" />
                      <span className="ml-2">Thông tin tài khoản</span>
                    </Button>

                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      className="w-full p-2 !justify-start"
                    >
                      <AiOutlineShoppingCart className="text-xl" />
                      <span className="ml-2">Giỏ hàng</span>
                    </Button>
                    {session?.user?.role !== "individual" && (
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        onClick={() => router.push("/products/product/add")}
                        className="w-full p-2 !justify-start"
                      >
                        <AiOutlinePlus className="text-xl" />
                        <span className="ml-2 text-base">Thêm hàng</span>
                      </Button>
                    )}

                    <div className="w-full h-[2px] bg-slate-200 dark:bg-dark-background my-1"></div>

                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      className="w-full mb-3 p-2 !justify-start"
                      onClick={() => signOut()}
                    >
                      <AiOutlineLogout className="text-xl" />
                      <span className="ml-2">Đăng xuất</span>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Button onClick={() => router.push("/login")}>Đăng nhập</Button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
