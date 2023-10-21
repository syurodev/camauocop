"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Tooltip,
  Button,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Card,
  CardBody,
  Input
} from "@nextui-org/react";
import Link from "next/link";
import {
  AiOutlineShoppingCart,
  AiOutlinePlus,
  AiOutlineBell,
} from "react-icons/ai";
import { Session } from "next-auth";
import { useDispatch } from "react-redux";
import { BiSearch } from "react-icons/bi"

import { ModeToggle } from "@/components/ModeToggle";
import UserMenu from "@/components/elements/UserMenu";
import { getNotifications, readNotifications } from "@/actions/notification";
import { INotification } from "@/lib/models/notification";
import { setCartItems } from "@/redux/features/cart-slice"
import { AppDispatch, useAppSelector } from "@/redux/store";
import { getCartItems } from "@/actions/cart"
import { setSession } from "@/redux/features/session-slice";
import Search from "../elements/Search";

type IProps = {
  sessionData: string
}

const Nav: React.FC<IProps> = ({ sessionData }) => {
  const [notifications, setNotifications] = useState<INotification[] | []>([]);
  const [notificationsNumber, setNotificationsNumber] = useState<number>(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [openSearchInput, setOpenSearchInput] = useState<boolean>(false)

  const session: Session = JSON.parse(sessionData)

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(setSession(session))

    const fetchNotifications = async () => {
      const res: INotificationResponse = await getNotifications(session?.user._id!, notifications.length)
      setNotifications(res.data)
    }

    const fetchCratItems = async () => {
      const res = await getCartItems(session?.user._id, session?.user.accessToken)
      if (res.code === 200 && res.data) {
        const data = JSON.parse(res.data)
        dispatch(setCartItems(data?.products!))
      }
    }

    if (sessionData) {
      fetchNotifications()
      fetchCratItems()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionData])

  const cartItems = useAppSelector((state) => state?.cartReducer?.value)

  const countUnreadNotifications = (notifications: INotification[]): number => {
    const unreadNotifications = notifications.filter((notification) => notification.status === 'unread');
    return unreadNotifications.length;
  };

  useEffect(() => {
    setNotificationsNumber(countUnreadNotifications(notifications))
  }, [
    notifications
  ])

  const router = useRouter();

  const handleNotificationPress = async (id: string, type: string) => {
    await readNotifications(id)
    if (type === "order") {
      if (session?.user.role === "shop") {
        router.push(`shop/${session.user.shopId}`)
      } else if (session?.user.role === "individual") {
        router.push(`/users/orders/${session.user._id}`)
      }
    }
    setIsNotificationsOpen(false)
  }

  return (
    <>

      <Navbar maxWidth="2xl">
        <NavbarBrand className="flex items-center h-full gap-2 flex-1">
          <Link href={"/"} className="font-bold">
            SeaMarketHub
          </Link>
        </NavbarBrand>

        <NavbarContent className="hidden md:!flex flex-[2]">
          <div className="relative w-[600px]">
            <Search />
          </div>

        </NavbarContent>

        <NavbarContent justify="end" className="flex items-center gap-2 flex-1">
          <ModeToggle className="!hidden lg:!flex" />
          {
            session?.user && (
              <Popover
                showArrow
                offset={10}
                placement="bottom"
                backdrop={"blur"}
                isOpen={isNotificationsOpen} onOpenChange={(open) => setIsNotificationsOpen(open)}
              >
                <PopoverTrigger>
                  <Button
                    radius="full"
                    isIconOnly
                    aria-label="more than 99 notifications"
                    variant="light"
                  >
                    <Badge
                      as="span"
                      content={notificationsNumber}
                      shape="circle"
                      color="danger"
                      className={`${notificationsNumber > 0 ? "flex" : "hidden"}`}
                    >
                      <AiOutlineBell className="text-xl" />
                    </Badge>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col gap-2 p-0 w-[95%] min-w-[200px] max-w-[500px]">
                  {
                    notifications.length > 0 ? (
                      notifications.map(notification => {
                        return (
                          <Card
                            isPressable
                            key={notification._id}
                            className={`${notification.status === "unread" ? "dark:bg-[#18181b] bg-[#f4f4f5]" : "bg-white dark:bg-black"}`}
                            onPress={() => handleNotificationPress(notification._id, notification.type)}
                          >
                            <CardBody>
                              {notification.content}
                            </CardBody>
                          </Card>
                        )
                      })
                    ) : (
                      <span className="line-clamp-1 p-2">Không có thông báo</span>
                    )
                  }
                </PopoverContent>
              </Popover>

            )
          }

          <div className="flex items-center h-full gap-5">
            {session?.user ? (
              <>
                {/* Giỏ hàng */}
                <Tooltip content="Giỏ hàng">
                  <Button
                    variant={"ghost"}
                    isIconOnly
                    radius="full"
                    className="border-none text-xl"
                    onClick={() => router.push(`/users/cart/${session.user._id}`)}

                  >
                    <Badge
                      as="span"
                      content={cartItems?.length || 0}
                      shape="circle"
                      color="success"
                      className={`${cartItems?.length || 0 > 0 ? "flex" : "hidden"}`}
                    >
                      <AiOutlineShoppingCart />
                    </Badge>
                  </Button>
                </Tooltip>
                {/* Thêm hàng */}
                {session?.user?.role !== "individual" && (
                  <Tooltip content="Thêm hàng">
                    <Button
                      variant={"ghost"}
                      isDisabled={session?.user.shopStatus === "block"}
                      isIconOnly
                      radius="full"
                      onClick={() => router.push("/products/product/add")}
                      className="border-none"
                    >
                      <AiOutlinePlus className="text-xl" />
                    </Button>
                  </Tooltip>
                )}

                <UserMenu session={session} />
              </>
            ) : (
              <Button
                className="bg-primary"
                onClick={() => router.push("/login")}
              >
                Đăng nhập
              </Button>
            )}
          </div>
        </NavbarContent>
      </Navbar>
    </>
  );
};

export default Nav;
