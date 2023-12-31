"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  AiOutlineGoogle,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import {
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Spinner,
  Select,
  SelectItem,
} from "@nextui-org/react";
import {
  UserRegisterZodSchema,
  IUserRegisterZodSchema,
} from "@/lib/zodSchema/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState("individual");
  const [userError, setUserError] = useState("");
  const [isVisiblePass, setIsVisiblePass] = useState(false);
  const [isVisibleRePass, setIsVisibleRePass] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IUserRegisterZodSchema>({
    defaultValues: {
      role: "individual"
    },
    resolver: zodResolver(UserRegisterZodSchema),
  });

  const toggleVisibilityPass = () => setIsVisiblePass(!isVisiblePass);
  const toggleVisibilityRePass = () => setIsVisibleRePass(!isVisibleRePass);

  const onSubmit = async (data: IUserRegisterZodSchema) => {
    const res = await fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const result = await res.json();
      if (result.status === 400) {
        setUserError(result.message);
      } else {
        router.push("/login");
      }
    } else {
      setUserError("Lỗi đăng ký vui lòng thử lại");
    }
  };

  return (
    <Card className="w-[90%] md:w-1/3 min-w-[400px] max-w-[500px] p-4">
      <CardHeader className="flex flex-col">
        <div className="text-center mb-2">
          <h1 className="font-semibold text-lg">SeaMarketHub</h1>
        </div>

        <div className="w-full flex flex-col justify-center items-center">
          <Button onClick={() => signIn("google", { callbackUrl: "/" })}>
            <AiOutlineGoogle className="text-xl" />
            <span className="ml-2 font-medium">Đăng ký với Google</span>
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Input
            isClearable
            type="text"
            label="Tên đăng nhập"
            variant="bordered"
            placeholder="Nhập tên đăng nhập của bạn"
            className="max-w-full "
            {...register("username")}
            isInvalid={!!errors?.username}
            errorMessage={errors?.username?.message}
          />

          <Input
            isClearable
            type="email"
            label="Email"
            variant="bordered"
            placeholder="Nhập email của bạn"
            className="max-w-full "
            {...register("email")}
            isInvalid={!!errors?.email}
            errorMessage={errors?.email?.message}
          />

          <Input
            label="Mật khẩu"
            variant="bordered"
            placeholder="Nhập mật khẩu của bạn"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibilityPass}
              >
                {isVisiblePass ? (
                  <AiOutlineEye className="text-xl" />
                ) : (
                  <AiOutlineEyeInvisible className="text-xl" />
                )}
              </button>
            }
            type={isVisiblePass ? "text" : "password"}
            className="max-w-full "
            {...register("password")}
            isInvalid={!!errors?.password}
            errorMessage={errors?.password?.message}
          />

          <Input
            label="Nhập lại mật khẩu"
            variant="bordered"
            placeholder="Nhập lại mật khẩu của bạn"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibilityRePass}
              >
                {isVisibleRePass ? (
                  <AiOutlineEye className="text-xl" />
                ) : (
                  <AiOutlineEyeInvisible className="text-xl" />
                )}
              </button>
            }
            type={isVisibleRePass ? "text" : "password"}
            className="max-w-full"
            {...register("confirmPassword")}
            isInvalid={!!errors?.confirmPassword}
            errorMessage={errors?.confirmPassword?.message}
          />

          <Select
            label="Chọn loại tài khoản"
            placeholder="Chọn loại tài khoản"
            description={role === "partner" ? "Tài khoản đối tác dùng để đăng các tour du lịch không dùng để bán hoặc mua hàng" : "Tài khoản thông thường có thể dùng để bán hoặc mua hàng"}
            defaultSelectedKeys={["individual"]}
            className="max-w-full"
            {...register("role")}
            onChange={e => {
              setRole(e.target.value)
              setValue("role", e.target.value)
            }}
          >
            <SelectItem key={"individual"} value={"individual"}>
              Thông thường
            </SelectItem>
            <SelectItem key={"partner"} value={"partner"}>
              Đối tác du lịch
            </SelectItem>
          </Select>

          <div className=" flex flex-col items-center justify-center">
            {userError && (
              <motion.p
                className="text-red-500 mb-3"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0 }}
              >
                {`${userError}`}
              </motion.p>
            )}

            <Button
              disabled={isSubmitting}
              type="submit"
              className="font-medium bg-primary"
            >
              {isSubmitting && (
                <Spinner size="sm" color="default" />
              )}
              Đăng ký
            </Button>
          </div>
        </form>
      </CardBody>

      <CardFooter className="w-full flex flex-col justify-center items-center">
        <p className="font-medium text-sm">
          Đã có tài khoản?{" "}
          <Link className="font-semibold" href={"/login"}>
            Đăng nhập
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
