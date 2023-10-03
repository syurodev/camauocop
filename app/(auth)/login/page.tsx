"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  AiOutlineGoogle,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";

import {
  UserLoginZodSchema,
  type IUserLoginZodSchema,
} from "@/lib/zodSchema/auth";

import { useForm } from "react-hook-form";
import {
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Spinner,
} from "@nextui-org/react";

export default function LoginPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [userError, setUserError] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IUserLoginZodSchema>({
    resolver: zodResolver(UserLoginZodSchema),
  });

  async function onSubmit(values: IUserLoginZodSchema) {
    const result = await signIn("credentials", {
      username: values.username,
      password: values.password,
      redirect: false,
      // callbackUrl: "/"
    });

    if (result) {
      if (result.url) {
        router.push("/");
      } else {
        setUserError("Tài khoản hoặc mật khẩu không đúng");
      }
    } else {
      setUserError("Lỗi đăng nhập vui lòng thử lại");
    }
  }

  return (
    <Card className="w-[90%] md:w-1/3 min-w-[400px] max-w-[500px] p-4">
      <CardHeader className="flex flex-col">
        <div className="text-center mb-5">
          <h1 className="font-semibold text-lg">SeaMarketHub</h1>
        </div>

        <div className="w-full flex flex-col justify-center items-center">
          <Button onClick={() => signIn("google", { callbackUrl: "/" })}>
            <AiOutlineGoogle className="text-xl" />
            <span className="ml-2 font-medium">Đăng nhập với Google</span>
          </Button>
        </div>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            isClearable
            type="text"
            label="Tên đăng nhập/ Email"
            variant="bordered"
            placeholder="Nhập email hoặc tên đăng nhập"
            className="max-w-full"
            {...register("username")}
          />
          {errors.username && (
            <motion.p
              className="text-red-500 mb-3"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0 }}
            >
              {`${errors.username.message}`}
            </motion.p>
          )}

          <Input
            label="Mật khẩu"
            variant="bordered"
            placeholder="Nhập mật khẩu của bạn"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <AiOutlineEye className="text-xl" />
                ) : (
                  <AiOutlineEyeInvisible className="text-xl" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
            className="max-w-full mt-4"
            {...register("password")}
          />
          {errors.password && (
            <motion.p
              className="text-red-500 mb-3"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0 }}
            >
              {`${errors.password.message}`}
            </motion.p>
          )}

          <div className="mt-3 flex flex-col items-center justify-center">
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
              Đăng nhập
            </Button>
          </div>
        </form>
      </CardBody>

      <CardFooter className="w-full flex flex-col justify-center items-center">
        <p className="font-normal text-sm">
          Chưa có tài khoản?{" "}
          <Link className="font-semibold" href={"/register"}>
            Đăng ký
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
