import { z } from 'zod';

export const AddProductZodSchema = z.object({
  sellerId: z.string(), // Assuming ObjectId is stored as string
  productType: z.string(), // Assuming ObjectId is stored as string
  name: z.string().min(1, 'Tên sản phẩm không thể bỏ trống'),
  description: z.string().min(1, 'Mô tả sản phẩm không thể bỏ trống'),
  price: z.string(),
  // .min(0.01, 'Giá sản phẩm phải lớn hơn 0'),
  quantity: z.string(),
  // .min(1, 'Số lượng sản phẩm phải lớn hơn hoặc bằng 1'),
  // images: z.array(z.string().url()).min(1, 'Ít nhất phải có một hình ảnh'),
})
export type IAddProductZodSchema = z.infer<typeof AddProductZodSchema>