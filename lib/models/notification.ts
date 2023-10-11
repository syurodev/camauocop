import mongoose, { Document, Schema } from 'mongoose';
import User from './users';
import Order from './orders';

// Interface for the Notification for TypeScript
export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  type: 'bid' | 'win' | 'event' | 'other';
  status: 'read' | 'unread';
  timestamp: Date;
  link?: string;
}

// Schema definition for Notification
const NotificationSchema: Schema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: User,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['bid', 'win', 'event', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['read', 'unread'],
    default: 'unread'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  orderId: {
    type: mongoose.Types.ObjectId,
    ref: Order,
    default: null
  }
});

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);