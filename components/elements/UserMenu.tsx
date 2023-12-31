import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Avatar,
  useDisclosure
} from "@nextui-org/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import {
  AiOutlineShop,
  AiOutlineSetting,
  AiOutlineLogout,
} from "react-icons/ai";
import { TbShoppingCartCopy } from "react-icons/tb";
import { LuMoon, LuSunMedium } from "react-icons/lu"
import { MdOutlineAdminPanelSettings } from "react-icons/md"
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAppSelector } from "@/redux/store";
import UserSetting from "../modal/UserSetting";

const UserMenu: React.FC = () => {
  const session: Session | null = useAppSelector(state => state.sessionReducer.value)
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
  const [themeIcon, setThemeIcon] = React.useState<string>("light")
  const { setTheme } = useTheme();
  const router = useRouter()

  React.useEffect(() => {
    const currentTheme = localStorage.getItem("seamarkethub-theme") || "dark"
    setThemeIcon(currentTheme)
  }, [])

  const changeTheme = () => {
    if (themeIcon === "dark") {
      setTheme("light")
      setThemeIcon("light")
    } else {
      setTheme("dark")
      setThemeIcon("dark")
    }
  }

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Avatar
            as="button"
            className="transition-transform"
            src={session?.user.image || ""}
          />
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Profile Actions"
          variant="flat"
          disabledKeys={session?.user.shopStatus === "block" ? ["my-shop"] : []}
        >
          <DropdownSection showDivider>
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Đã đăng nhập với</p>
              <p className="font-semibold">
                {session?.user.email || session?.user.username}
              </p>
              {
                session?.user.shopStatus === "block" && (
                  <p className="text-warning">Cửa hàng đã bị khoá, bạn chỉ có thể mua hàng</p>
                )
              }
            </DropdownItem>
          </DropdownSection>

          <DropdownSection
            showDivider
            className={`${session?.user.role === "admin" || session?.user.role === "partner" ? "hidden" : "block"}`}
          >
            <DropdownItem
              key="my-order"
              startContent={<TbShoppingCartCopy className="text-lg" />}
            >
              <Link href={`/users/orders/${session?.user._id}`}>Đơn hàng của tôi</Link>
            </DropdownItem>
          </DropdownSection>

          <DropdownSection showDivider
            className={`${session?.user.role === "shop" || session?.user.role === "staff" ? "block" : "hidden"}`}
          >
            <DropdownItem
              key="my-shop"
              startContent={<AiOutlineShop className="text-lg" />}
            >
              <Link href={`/shop/${session?.user.shopId}`}>Cửa hàng của tôi</Link>
            </DropdownItem>
          </DropdownSection>

          <DropdownSection showDivider
            className={`${session?.user.role === "partner" ? "block" : "hidden"}`}
          >
            <DropdownItem
              key="my-shop"
              startContent={<AiOutlineShop className="text-lg" />}
            >
              <Link href={`/partner/${session?.user._id}`}>Quản lý tour</Link>
            </DropdownItem>
          </DropdownSection>

          <DropdownSection showDivider
            className={`${session?.user.role === "individual" ? "block" : "hidden"}`}
          >
            <DropdownItem
              key="register-shop"
              startContent={<AiOutlineShop className="text-lg" />}
              onPress={() =>
                router.push(`/users/shop/register`)
              }
            >
              <span>Đăng ký bán hàng</span>
            </DropdownItem>
          </DropdownSection>

          <DropdownSection
            showDivider
            className={`${session?.user.role === "admin" ? "block" : "hidden"}`}
          >
            <DropdownItem
              key="register-shop"
              startContent={<MdOutlineAdminPanelSettings className="text-lg" />}
              onPress={() =>
                router.push(`/admin`)
              }
            >
              <span>Quản lý hệ thống</span>
            </DropdownItem>
          </DropdownSection>

          <DropdownSection showDivider>
            <DropdownItem
              key="settings"
              startContent={<AiOutlineSetting className="text-lg" />}
              onPress={onOpen}
            >
              <span>Cài đặt tài khoản</span>
            </DropdownItem>
          </DropdownSection>

          <DropdownSection>
            <DropdownItem
              key="change-theme"
              onClick={changeTheme}
              className="!flex lg:!hidden"
              startContent={
                themeIcon === "light" ? (
                  <div className="h-[1.2rem] w-[1.2rem]">
                    <LuSunMedium className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  </div>
                ) : (
                  <div className="h-[1.2rem] w-[1.2rem]">
                    <LuMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  </div>
                )
              }
            >
              {
                themeIcon === "light" ? <span>Chế độ sáng</span> : <span>Chế độ tối</span>
              }
            </DropdownItem>

            <DropdownItem
              key="logout"
              color="danger"
              onClick={() => signOut()}
              startContent={<AiOutlineLogout className="text-lg" />}
            >
              <span>Đăng xuất</span>
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>

      <UserSetting
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
      />
    </>
  );
};
export default UserMenu;
