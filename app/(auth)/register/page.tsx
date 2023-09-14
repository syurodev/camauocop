"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AiOutlineGoogle } from "react-icons/ai";

import { Button } from "@/components/ui/button";
import {
  UserRegisterZodSchema,
  IUserRegisterZodSchema,
} from "@/lib/zodSchema/auth";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [userError, setUserError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<IUserRegisterZodSchema>({
    resolver: zodResolver(UserRegisterZodSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: IUserRegisterZodSchema) => {
    setIsSubmitting(true);
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
        setIsSubmitting(false);
        setUserError(result.message);
      } else {
        setIsSubmitting(false);
        router.push("/login");
      }
    } else {
      setIsSubmitting(false);
      setUserError("Lỗi đăng ký vui lòng thử lại");
    }
  };

  return (
    <motion.section
      className="glassmorphism transition-all duration-150 max-sm:w-full md:max-w-xl w-[500px] p-4 sm:px-6 md:px-8"
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0 }}
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

          <span className="ml-2">Đăng ký với Google</span>
        </Button>
      </motion.div>

      <Form {...form}>
        <motion.form onSubmit={form.handleSubmit(onSubmit)}>
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
                  <FormLabel>Tên đăng nhập: </FormLabel>
                  <FormControl>
                    <Input placeholder="Tên đăng nhập" {...field} />
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
              name="email"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormLabel>Email: </FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
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
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormLabel>Nhập lại mật khẩu: </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Nhập lại mật khẩu"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            className="mt-4 flex flex-col items-center justify-center"
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
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
              Đăng ký
            </Button>
          </motion.div>
        </motion.form>
      </Form>
      <motion.div
        className="w-full flex flex-col justify-center items-center"
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="mt-3 font-normal text-sm">
          Đã có tài khoản?{" "}
          <Link className="font-semibold" href={"/login"}>
            Đăng nhập
          </Link>
        </p>
      </motion.div>
    </motion.section>
  );
}
