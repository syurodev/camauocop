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
      className={`sticky h-[60px] top-0 z-50 w-full backdrop-blur-sm flex-none 
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

          <div className="hidden lg:!flex items-center h-full gap-5">
            {session?.user ? (
              <>
                {/* Giỏ hàng */}
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="p-2 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                </Button>

                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="p-2 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                    />
                  </svg>
                </Button>

                {/* Thêm hàng */}
                {session?.user?.role !== "individual" && (
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    onClick={() => router.push("/products/product/add")}
                    className="p-2 rounded-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                          />
                        </svg>
                        <span className="ml-2">Thông tin tài khoản</span>
                      </Button>
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        className="w-full !justify-start"
                        onClick={() => signOut()}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                          />
                        </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                      <span className="ml-2">Thông tin tài khoản</span>
                    </Button>

                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      className="w-full p-2 !justify-start"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                        />
                      </svg>
                      <span className="ml-2">Giỏ hàng</span>
                    </Button>
                    {session?.user?.role !== "individual" && (
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        onClick={() => router.push("/products/product/add")}
                        className="w-full p-2 !justify-start"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                        <span className="ml-2">Thêm hàng</span>
                      </Button>
                    )}

                    <div className="w-full h-[2px] bg-slate-200 dark:bg-dark-background my-1"></div>

                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      className="w-full mb-3 p-2 !justify-start"
                      onClick={() => signOut()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                        />
                      </svg>
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
