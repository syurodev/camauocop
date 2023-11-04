type TourismsStatus = "waiting" | "accepted" | "refuse"

type DestinationData = {
  _id: string;
  name: string;
  images: string[];
  description: string;
}

type TransportationData = {
  _id: string;
  name: string;
  tourCount: number
}