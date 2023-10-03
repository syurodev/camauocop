import { z } from 'zod';

export const OrderProductZodSchema = z.object({
  productId: z.string().optional(),
  quantity: z.number().min(0, "Số lượng sản phẩm phải lớn hơn 0")
})

export const OrderZodSchema = z.object({
  buyerId: z.string().optional(),
  products: z.array(OrderProductZodSchema).nonempty("Đơn hàng phải có sản phẩm"),
  totalAmount: z.number().optional(),
  delivery: z.array(z.string()).nonempty("Vui lòng chọn đơn vị vận chuyển"),
  province: z.string().nonempty("Vui lòng chọn tỉnh"),
  district: z.string().nonempty("Vui lòng chọn tỉnh"),
  ward: z.string().nonempty("Vui lòng chọn tỉnh"),
  apartment: z.string().nonempty("Vui lòng nhập số nhà"),
})

export type IOrderZodSchema = z.infer<typeof OrderZodSchema>

