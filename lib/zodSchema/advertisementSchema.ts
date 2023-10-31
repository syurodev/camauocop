import { z } from "zod";

const AdvertisementSchema = z.object({
  shopId: z.string(),
  image: z.string(),
  note: z.string(),
  status: z.string(),
  type: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export type IAdvertisementSchema = z.infer<typeof AdvertisementSchema>;

export { AdvertisementSchema };
