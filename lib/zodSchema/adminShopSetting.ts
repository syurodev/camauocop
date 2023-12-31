import { z } from 'zod';

export const AdminShopSettingSchema = z.object({
  type: z.string().nonempty("Vui lòng chọn loại cửa hàng"),
  status: z.string().nonempty("Vui lòng chọn trạng thái cửa hàng"),
  tax: z.string().optional(),
  fee: z.coerce.number().min(0, "Phí dịch vụ phải là số dương")
})

export type IAdminShopSettingSchema = z.infer<typeof AdminShopSettingSchema>
