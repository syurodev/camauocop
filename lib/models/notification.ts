import mongoose, { Document, Schema } from 'mongoose';
import User from './users';
import Order from './orders';

// Interface for the Notification for TypeScript
export interface INotification extends Document {
  userId: string;
  orderId: string;
  content: string;
  type: 'bid' | 'win' | 'event' | 'order';
  status: 'read' | 'unread';
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
    enum: ['bid', 'win', 'event', 'order'],
    required: true
  },
  status: {
    type: String,
    enum: ['read', 'unread'],
    default: 'unread'
  },
  orderId: {
    type: mongoose.Types.ObjectId,
    ref: Order,
    default: null
  }
}, {
  timestamps: true,
}
);

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);