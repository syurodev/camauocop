"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { AiOutlineGoogle } from "react-icons/ai";

import {
  UserLoginZodSchema,
  type IUserLoginZodSchema,
} from "@/lib/zodSchema/auth";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [userError, setUserError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<IUserLoginZodSchema>({
    resolver: zodResolver(UserLoginZodSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: IUserLoginZodSchema) {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      username: values.username,
      password: values.password,
      redirect: false,
      // callbackUrl: "/"
    });

    if (result) {
      if (result.url) {
        setIsSubmitting(false);
        router.push("/");
      } else {
        setUserError("Tài khoản hoặc mật khẩu không đúng");
        setIsSubmitting(false);
      }
    } else {
      setUserError("Lỗi đăng nhập vui lòng thử lại");
      setIsSubmitting(false);
    }
  }

  return (
    <motion.section
      className="glassmorphism max-sm:w-full md:max-w-xl w-[500px] p-4 sm:px-6 md:px-8"
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <motion.div
        className="text-center mb-5"
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="font-semibold text-lg">SeaMarketHub</h1>
      </motion.div>

      <motion.div
        className="w-full flex flex-col justify-center items-center mb-5"
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Button onClick={() => signIn("google", { callbackUrl: "/" })}>
          <AiOutlineGoogle className="text-xl" />
          <span className="ml-2">Đăng nhập với Google</span>
        </Button>
      </motion.div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <motion.div
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên đăng nhập hoặc Email: </FormLabel>
                  <FormControl>
                    <Input placeholder="username hoặc email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormLabel>Mật khẩu: </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Mật khẩu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
          <motion.div
            className="mt-3 flex flex-col items-center justify-center"
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
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

            <Button disabled={isSubmitting} type="submit">
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Đăng nhập
            </Button>
          </motion.div>
        </form>
      </Form>

      <motion.div
        className="w-full flex flex-col justify-center items-center"
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="mt-3 font-normal text-sm">
          Chưa có tài khoản?{" "}
          <Link className="font-semibold" href={"/register"}>
            Đăng ký
          </Link>
        </p>
      </motion.div>
    </motion.section>
  );
}
