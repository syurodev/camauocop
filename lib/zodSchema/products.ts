import { z } from "zod";

const DescriptionDataSchema = z.object({
  type: z.string(),
  content: z.array(z.unknown()).refine((data) => data.length > 0, {
    message: "Mô tả sản phẩm không được để trống",
  }),
});

export const AddProductZodSchema = z.object({
  shopId: z.string().optional(),
  productType: z.string().nonempty("Vui lòng chọn loại sản phẩm"),
  name: z.string().nonempty("Tên sản phẩm không thể bỏ trống"),
  description: DescriptionDataSchema.optional(),
  images: z.array(z.string().url()).nonempty("Ít nhất phải có một hình ảnh"),
  // price: z.coerce.number().min(1, "Giá tiền không được bằng 0"),
  // .min(0.01, 'Giá sản phẩm phải lớn hơn 0'),
  quantity: z.coerce.number().min(1, "Số lượng sản phẩm không được bằng 0"),
  // .min(1, 'Số lượng sản phẩm phải lớn hơn hoặc bằng 1'),
  packageOptions: z.array(
    z.object({
      unit: z.string(),
      weight: z.coerce.number(),
      price: z.coerce.number(),
      length: z.coerce.number(),
      width: z.coerce.number(),
      height: z.coerce.number(),
    })
  ),
  retailPrice: z.optional(z.coerce.number()),
  retail: z.boolean(),
  specialty: z.boolean(),
  unit: z.string().nonempty("Vui lòng chọn đơn vị tính"),
});
export type IAddProductZodSchema = z.infer<typeof AddProductZodSchema>;

export const AddProductTypeZodSchema = z.object({
  shopId: z.string().optional(),
  name: z.string().trim().nonempty("Tên loại sản phẩm không thể bỏ trống"),
});
export type IAddProductTypeZodSchema = z.infer<typeof AddProductTypeZodSchema>;
