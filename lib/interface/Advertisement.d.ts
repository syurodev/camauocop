type AdvertisementStatus = "accept" | "refused" | "running" | "stopped" | "waiting"
type AdvertisementType = "home" | "public"

type Ads = {
  _id: string
  image: string
  note: string
  type: AdvertisementType
  status: AdvertisementStatus
  startDate: string
  endDate: string
  createdAt: string
}