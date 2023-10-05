import { z } from 'zod';

export const OrderProductZodSchema = z.object({
  productId: z.string().optional(),
  quantity: z.coerce.number().optional(),
  unit: z.string().optional(),
  package: z.object({
    unit: z.string(),
    weight: z.coerce.number(),
    price: z.coerce.number(),
  }).optional(),
  retail: z.boolean()
})

export const OrderZodSchema = z.object({
  buyerId: z.string().optional(),
  products: z.array(OrderProductZodSchema).optional(),
  totalAmount: z.number().optional(),
  delivery: z.array(z.string()).nonempty("Vui lòng chọn đơn vị vận chuyển"),
  province: z.string().nonempty("Vui lòng chọn tỉnh"),
  district: z.string().nonempty("Vui lòng chọn tỉnh"),
  ward: z.string().nonempty("Vui lòng chọn tỉnh"),
  apartment: z.string().nonempty("Vui lòng nhập số nhà"),
})

export type IOrderZodSchema = z.infer<typeof OrderZodSchema>

