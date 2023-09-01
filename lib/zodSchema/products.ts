import { z } from 'zod';

export const AddProductZodSchema = z.object({
  sellerId: z.string(), // Assuming ObjectId is stored as string
  productType: z.string(), // Assuming ObjectId is stored as string
  name: z.string().min(1, 'Tên sản phẩm không thể bỏ trống'),
  description: z.string(),
  price: z.coerce.number().min(1, "Giá tiền không được bằng 0"),
  // .min(0.01, 'Giá sản phẩm phải lớn hơn 0'),
  quantity: z.coerce.number().min(1, "Số lượng sản phẩm không được bằng 0"),
  // .min(1, 'Số lượng sản phẩm phải lớn hơn hoặc bằng 1'),
  images: z.array(z.string().url()).min(1, 'Ít nhất phải có một hình ảnh'),
  auction: z.boolean()
})
export type IAddProductZodSchema = z.infer<typeof AddProductZodSchema>