import { z } from 'zod';

export const OrderProductZodSchema = z.object({
  productId: z.string().optional(),
  quantity: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
  unit: z.string().optional(),
  // package: z.object({
  //   unit: z.string(),
  //   weight: z.coerce.number(),
  //   price: z.coerce.number(),
  // }).optional(),
  price: z.coerce.number().optional(),
  length: z.coerce.number().optional(),
  width: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  retail: z.boolean(),
  productSnapshot: z.object({
    name: z.string(),
    retailPrice: z.number(),
    images: z.array(z.string().url()),
    retail: z.boolean(),
    packageOptions: z.array(
      z.object({
        unit: z.string(),
        weight: z.coerce.number(),
        price: z.coerce.number(),
      })
    )
  }).optional()
})

export const OrderZodSchema = z.object({
  buyerId: z.string().optional(),
  shopId: z.string().optional(),
  products: z.array(OrderProductZodSchema).optional(),
  totalAmount: z.coerce.number().optional(),
  delivery: z.array(z.string()).nonempty("Vui lòng chọn đơn vị vận chuyển"),
  province: z.string().nonempty("Vui lòng chọn tỉnh"),
  district: z.string().nonempty("Vui lòng chọn tỉnh"),
  ward: z.string().nonempty("Vui lòng chọn tỉnh"),
  apartment: z.string().nonempty("Vui lòng nhập số nhà"),
})

export type IOrderZodSchema = z.infer<typeof OrderZodSchema>

export const DeliveryOrderSchema = z.object({
  required_note: z.string(),
  to_name: z.string().optional(),
  to_phone: z.string().optional(),
  to_address: z.string().optional(),
  to_ward_name: z.string().optional(),
  to_ward_code: z.string().optional(),
  to_district_name: z.string().optional(),
  weight: z.coerce.number().optional(),
  length: z.coerce.number(),
  width: z.coerce.number(),
  height: z.coerce.number(),
  service_type_id: z.coerce.number().optional(),
  payment_type_id: z.coerce.number(),
  Items: z.array(
    z.object({
      name: z.string(),
      quantity: z.coerce.number(),
    })
  ).optional(),
});

export type IDeliveryOrderSchema = z.infer<typeof DeliveryOrderSchema>
