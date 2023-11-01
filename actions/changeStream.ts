"use server"

import Advertisement, { IAdvertisement } from "@/lib/models/advertisement"

const changeStream = Advertisement.watch();

changeStream.on('change', async (change) => {
  if (change.operationType === 'update' && change.fullDocument) {
    const currentDate = new Date();
    const status = change.fullDocument.status;
    const startDate = new Date(change.fullDocument.startDate);
    const endDate = new Date(change.fullDocument.endDate);

    if (status === 'accept' && currentDate >= startDate) {
      try {
        // Chuyển từ "accept" sang "running"
        await Advertisement.updateOne({ _id: change.documentKey._id }, { $set: { status: 'running' } });
        console.log('Đã chuyển trạng thái thành "running".');
        // Thực hiện các thay đổi cần thiết
      } catch (error) {
        console.error('Lỗi cập nhật trạng thái:', error);
      }
    } else if (status === 'running' && currentDate >= endDate) {
      try {
        // Chuyển từ "running" sang "stopped"
        await Advertisement.updateOne({ _id: change.documentKey._id }, { $set: { status: 'stopped' } });
        console.log('Đã chuyển trạng thái thành "stopped".');
        // Thực hiện các thay đổi cần thiết
      } catch (error) {
        console.error('Lỗi cập nhật trạng thái:', error);
      }
    }
  }
});
