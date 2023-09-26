import { z } from 'zod';

export const OrderProductZodSchema = z.object({
  productId: z.string().optional(),
  quantity: z.number().min(0, "Số lượng sản phẩm phải lớn hơn 0")
})

export const OrderZodSchema = z.object({
  buyerId: z.string().optional(),
  products: z.array(OrderProductZodSchema).nonempty("Đơn hàng phải có sản phẩm"),
  totalAmount: z.number().optional()
})

export type IOrderZodSchema = z.infer<typeof OrderZodSchema>

