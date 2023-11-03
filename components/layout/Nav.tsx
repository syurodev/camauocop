"use client";

import { useEffect, useRef, useState } from "react";
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
  const parentDivRef = useRef<HTMLDivElement | null>(null);
  const [parentDivSize, setParentDivSize] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (parentDivRef.current) {
        const width = parentDivRef.current.offsetWidth;
        setParentDivSize(width);
      }
    };

    // Đăng ký sự kiện resize
    window.addEventListener('resize', handleResize);

    handleResize();
    // Khi component unmount, hủy đăng ký sự kiện resize
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [parentDivRef]);

  const userSession: Session = JSON.parse(sessionData)

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(setSession(userSession))

    const fetchNotifications = async () => {
      const res: INotificationResponse = await getNotifications(userSession?.user._id!, notifications.length)
      setNotifications(res.data)
    }

    const fetchCratItems = async () => {
      const res = await getCartItems(userSession?.user._id, userSession?.user.accessToken)
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

  const cartItems = useAppSelector((state) => state?.cartReducer.value)
  const session = useAppSelector((state) => state?.sessionReducer?.value)

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
        <NavbarBrand style={{ flex: 1 }} className="flex items-center h-full gap-2 w-fit">
          <Link href={"/"} className="font-bold">
            SeaMarketHub
          </Link>
        </NavbarBrand>

        <NavbarContent style={{ flex: 2 }} className="hidden md:!flex">
          <div ref={parentDivRef} className="relative w-full">
            <Search width={parentDivSize} />
          </div>
        </NavbarContent>

        <NavbarContent style={{ flex: 1 }} justify="end" className="flex items-center gap-2">
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
                {
                  session?.user.role !== "admin" && session?.user.role !== "partner" && (
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
                  )
                }
                {/* Thêm hàng */}
                {session?.user?.role === "shop" && (
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

                {/* Thêm hàng */}
                {session?.user?.role === "partner" && (
                  <Tooltip content="Thêm Tour">
                    <Button
                      variant={"ghost"}
                      isDisabled={session?.user.shopStatus === "block"}
                      isIconOnly
                      radius="full"
                      onClick={() => router.push("/tourisms/tourism/add")}
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
