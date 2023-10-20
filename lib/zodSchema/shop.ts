import { z } from 'zod';

export const UserRegisterShopZodSchema = z.object({
  auth: z.string().optional(),
  name: z.string().nonempty("Vui lòng nhập tên cửa hàng"),
  phone: z
    .string()
    .refine((value) => /^0\d{9}$/.test(value), {
      message: "Số điện thoại không hợp lệ. Phải có 10 số và bắt đầu bằng số 0",
    })
    .refine((value) => value.trim() !== "", {
      message: "Số điện thoại là bắt buộc",
    }),
  tax: z
    .string()
    .refine((value) => /^\d{10}$/.test(value), {
      message: "Mã số thuế phải có 10 chữ số",
    })
    .optional(),
  delivery: z.array(z.string()).nonempty("Vui lòng chọn đơn vị vận chuyển"),
  province: z.string()
    .nonempty("Vui lòng chọn tỉnh")
    .refine((value) => value === "Cà Mau", {
      message: "Chúng tôi chỉ hỗ trợ cửa hàng/doanh nghiệp Cà Mau",
    }),
  type: z.string().nonempty("Vui lòng chọn loại cửa hàng"),
  district: z.string().nonempty("Vui lòng chọn tỉnh"),
  ward: z.string().nonempty("Vui lòng chọn tỉnh"),
  apartment: z.string().nonempty("Vui lòng nhập số nhà"),
})

export type IUserRegisterShopZodSchema = z.infer<typeof UserRegisterShopZodSchema>


