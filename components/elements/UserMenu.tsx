import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Avatar,
} from "@nextui-org/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import {
  AiOutlineShop,
  AiOutlineSetting,
  AiOutlineLogout,
} from "react-icons/ai";
import { IoAnalyticsOutline } from "react-icons/io5";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

type IProps = {
  session: Session;
};

const UserMenu: React.FC<IProps> = ({ session }) => {
  const [themeIcon, setThemeIcon] = React.useState<string>("light")
  const { setTheme } = useTheme();

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
            src={session?.user.image}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownSection showDivider>
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Đã đăng nhập với</p>
              <p className="font-semibold">
                {session?.user.email || session?.user.username}
              </p>
            </DropdownItem>
          </DropdownSection>

          <DropdownSection showDivider
            className={`${session?.user.role !== "individual" ? "block" : "hidden"}`}
          >
            <DropdownItem
              key="settings"
              startContent={<AiOutlineShop className="text-lg" />}
            >
              Cửa hàng của tôi
            </DropdownItem>

            <DropdownItem
              key="team_settings"
              startContent={<IoAnalyticsOutline className="text-lg" />}
            >
              Thống kê
            </DropdownItem>
          </DropdownSection>

          <DropdownSection showDivider>
            <DropdownItem
              key="help_and_feedback"
              startContent={<AiOutlineSetting className="text-lg" />}
            >
              Cài đặt tài khoản
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
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  </div>
                ) : (
                  <div className="h-[1.2rem] w-[1.2rem]">
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
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
              Đăng xuất
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};
export default UserMenu;
