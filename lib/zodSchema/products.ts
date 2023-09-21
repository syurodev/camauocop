import { z } from "zod";

const OutputDataSchema = z.object({
  time: z.number().min(0, { message: "Mô tả sản phẩm không được để trống" }),
  blocks: z.array(z.unknown()).refine((data) => data.length > 0, {
    message: "Mô tả sản phẩm không được để trống",
  }),
  version: z.string().nonempty("Mô tả sản phẩm không được để trống"),
});

export const AddProductZodSchema = z.object({
  sellerId: z.string().optional(),
  productType: z.string().nonempty("Vui lòng chọn loại sản phẩm"),
  name: z.string().nonempty("Tên sản phẩm không thể bỏ trống"),
  description: OutputDataSchema,
  price: z.coerce.number().min(1, "Giá tiền không được bằng 0"),
  // .min(0.01, 'Giá sản phẩm phải lớn hơn 0'),
  quantity: z.coerce.number().min(1, "Số lượng sản phẩm không được bằng 0"),
  // .min(1, 'Số lượng sản phẩm phải lớn hơn hoặc bằng 1'),
  images: z.array(z.string().url()).nonempty("Ít nhất phải có một hình ảnh"),
  auction: z.boolean().optional(),
});
export type IAddProductZodSchema = z.infer<typeof AddProductZodSchema>;

export const AddProductTypeZodSchema = z.object({
  userId: z.string().optional(),
  name: z.string().trim().nonempty("Tên loại sản phẩm không thể bỏ trống"),
});
export type IAddProductTypeZodSchema = z.infer<typeof AddProductTypeZodSchema>;
