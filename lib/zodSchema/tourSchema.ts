import { z } from "zod";

const DescriptionDataSchema = z.object({
  type: z.string().optional(),
  content: z.array(z.unknown()).refine((data) => data.length > 0, {
    message: "Mô tả sản phẩm không được để trống",
  }).optional(),
});

export const tourSchema = z.object({
  tourName: z.string(),
  description: DescriptionDataSchema.optional(),
  destination: z.string(),
  duration: z.string(), // Định dạng theo số ngày và đêm, ví dụ: "5 days, 4 nights"
  price: z.coerce.number(),
  numberOfPeople: z.string(),
  tourType: z.string(), // Loại tour, ví dụ: "adventure", "sightseeing", "resort"
  itinerary: z.array(
    z.object({
      time: z.string(),
      action: z.string(),
    })
  ), // Danh sách các hoạt động trong tour
  transportation: z.string(), // Phương tiện di chuyển, ví dụ: "flight", "bus"
  accommodation: z.string(), // Thông tin về chỗ ở
  inclusions: z.array(
    z.object({
      content: z.string(),
    })
  ), // Dịch vụ bao gồm
  exclusions: z.array(z.object({
    content: z.string(),
  })), // Dịch vụ không bao gồm
  optionalActivities: z.array(z.object({
    content: z.string().optional(),
  })).optional(), // Các hoạt động tùy chọn
  specialRequirements: z.array(z.object({
    content: z.string().optional(),
  })).optional(), // Yêu cầu đặc biệt
  contactInformation: z.object({
    name: z.string(),
    email: z.string().email().optional(),
    phone: z.string()
      .refine((value) => /^0\d{9}$/.test(value), {
        message: "Số điện thoại không hợp lệ. Phải có 10 số và bắt đầu bằng số 0",
      })
      .refine((value) => value.trim() !== "", {
        message: "Số điện thoại là bắt buộc",
      }),
    link: z.string().url()
  }),
  // languages: z.array(z.string()), // Ngôn ngữ trong tour
});

export type ITourSchema = z.infer<typeof tourSchema>