"use server"

import Notification, { INotification } from "@/lib/models/notification";
import { connectToDB } from "@/lib/utils";

export const getNotifications = async (userId: string, loadedNotificationsCount: number = 0): Promise<INotificationResponse> => {
  try {
    await connectToDB()

    const notifications: INotification[] = await Notification.find({ userId: userId })
      .sort({ createdAt: 1 })
      .skip(loadedNotificationsCount)
      .limit(20);

    if (notifications.length > 0) {
      return {
        code: 200,
        data: notifications.map(item => {
          return {
            userId: item.userId.toString(),
            orderId: item.orderId.toString(),
            content: item.content,
            type: item.type as NotificationType,
            status: item.status as NotificationStatus,
          }
        })
      }
    } else {
      return {
        code: 200,
        data: []
      }
    }


  } catch (error) {
    console.error(error)
    return {
      code: 500,
      data: []
    }
  }
}

export const readNotifications = async (id: string) => {
  try {
    await connectToDB()
    await Notification.findByIdAndUpdate(id, {
      status: "read"
    })
    return
  } catch (error) {
    console.log(error)
    return
  }
}