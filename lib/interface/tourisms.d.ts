type TourismsStatus = "waiting" | "accepted" | "refuse"

type DestinationData = {
  _id: string;
  name: string;
  images: string[];
  description: {
    type: string;
    content: any[];
  };
  tourCount: number
}

type TransportationData = {
  _id: string;
  name: string;
  description: string;
  tourCount: number
}

type TourTypeData = {
  _id: string;
  name: string;
  tourCount: number
}

type TourData = {
  _id: string,
  username: string
  avatar: string
  status: TourismsStatus;
  tourName: string;
  destinationName: string
  duration: string;
  price: number;
  tourTypeName: string;
  note?: string;
}

type TourDetailData = {
  _id: string,
  userid: string,
  username: string
  avatar: string
  status: TourismsStatus;
  tourName: string;
  destinationId: string
  destinationName: string
  duration: string;
  price: number;
  numberOfPeople: string;
  tourTypeId: string;
  tourTypeName: string;
  itinerary: {
    time: string;
    action: string;
  }[];
  transportation: {
    _id: string,
    name: string
  }[];
  accommodation: string;
  tourContracts: string[];
  inclusions: {
    content: string;
  }[];
  exclusions: {
    content: string;
  }[];
  contactInformation: {
    name: string;
    email: string;
    phone: string;
    link: string;
  };
  optionalActivities?: {
    content?: string;
  }[];
  specialRequirements?: {
    content?: string;
  }[];
  note?: string;
}