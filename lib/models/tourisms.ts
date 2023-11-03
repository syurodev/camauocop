import mongoose, { Document, Schema } from "mongoose";
import User from "./users";
import TourType from "./tourType";
import Transportation from "./transportation";
import Destination from "./destination";

export interface ITourisms extends Document {
  userId: string;
  status: TourismsStatus;
  tourName: string;
  description: {
    type: string;
    content: any[];
  };
  destination: string;
  duration: string;
  price: number;
  numberOfPeople: string;
  tourType: string;
  itinerary: [{
    time: string;
    action: string;
  }];
  transportation: string;
  accommodation: string;
  inclusions: [{
    content: string;
  }];
  exclusions: [{
    content: string;
  }];
  contactInformation: {
    name: string;
    email: string;
    phone: string;
    link: string;
  };
  optionalActivities?: [{
    content?: string;
  }];
  specialRequirements?: [{
    content?: string;
  }];
  note?: string;
}

const TourismSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: User, required: true },
    status: {
      type: String,
      enum: ["waiting", "accepted", "refuse"],
      required: true,
      default: "waiting",
    },
    tourName: { type: String, required: true },
    description: {
      type: { type: String },
      content: { type: Array },
    },
    destination: { type: Schema.Types.ObjectId, ref: Destination, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    numberOfPeople: { type: String, required: true },
    tourType: { type: Schema.Types.ObjectId, ref: TourType, required: true },
    itinerary: [
      {
        time: { type: String, required: true },
        action: { type: String, required: true }
      }
    ],
    transportation: { type: Schema.Types.ObjectId, ref: Transportation, required: true },
    accommodation: { type: String, required: true },
    inclusions: [
      {
        content: { type: String, required: true },
      }
    ],
    exclusions: [
      {
        content: { type: String, required: true },
      }
    ],
    optionalActivities: [
      {
        content: { type: String },
      }
    ],
    specialRequirements: [
      {
        content: { type: String },
      }
    ],
    contactInformation: {
      name: { type: String, required: true },
      email: { type: String },
      phone: { type: String, required: true },
      link: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Tourism || mongoose.model<ITourisms>("Tourism", TourismSchema);
