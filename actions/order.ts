"use server"

import { convertToKg } from "@/lib/convertToKg";
import Fee, { IFee } from "@/lib/models/fee";
import Notification, { INotification } from "@/lib/models/notification";
import Order from "@/lib/models/orders"
import Product, { IProduct } from "@/lib/models/products";
import Shop, { IShop } from "@/lib/models/shop";
import { connectToDB, verifyJwtToken } from "@/lib/utils";
import { IDeliveryOrderSchema, IOrderZodSchema } from "@/lib/zodSchema/order"
import { GHNCreateOrder } from "./delivery";

type IGetOrdersProps = {
  id: string
  accessToken: string
  role?: UserRole,
  page?: number;
  perPage?: number;
}

type IProductOrder = {
  productId: string,
  productSnapshot: {
    name: string,
    images: string[],
    retail: boolean,
    retailPrice: number
    packageOptions: [
      unit: WeightUnit,
      weight: number,
      price: number
    ]
  },
  quantity: number,
  unit: string,
  weight: number,
  price: number,
  retail: boolean,
  _id: string
  length?: number;
  width?: number;
  height?: number;
}

export const createOrder = async (data: IOrderZodSchema) => {
  try {
    await connectToDB();

    const productSnapshots = await Promise.all(
      data.products!.map(async (productInOrder) => {
        const product = await Product.findById(productInOrder.productId);
        if (!product) {
          throw new Error(`Product with ID ${productInOrder.productId} not found.`);
        }
        return {
          name: product.name,
          retail: product.retail,
          retailPrice: product.retailPrice,
          images: product.images,
          packageOptions: product.packageOptions,
          productType: product.productType
        };
      })
    );

    // Thêm productSnapshots vào dữ liệu truyền vào
    data.products!.forEach((productInOrder, index) => {
      productInOrder.productSnapshot = productSnapshots[index];
    });

    const order = new Order(data)

    await Promise.all(
      data.products!.map(async (productInOrder) => {
        const product = await Product.findById(productInOrder.productId);
        if (!product) {
          return {
            code: 400,
            message: `Sản phẩm với ID ${productInOrder.productId} không thể tìm thấy.`
          }
        } else {
          const quantity = productInOrder.quantity || 1
          if (productInOrder.unit === "kg") {
            if (product.quantity >= productInOrder.weight! * quantity) {
              const newQuantity = product.quantity - (productInOrder.weight! * quantity)
              await Product.findByIdAndUpdate(productInOrder.productId, { quantity: newQuantity });
            } else {
              return {
                code: 400,
                message: `Sản phẩm ${productInOrder.productSnapshot?.name} đã vượt quá số lượng sản phẩm.`
              }
            }
          } else {
            const convertWeight = convertToKg(productInOrder.weight!, productInOrder.unit!)

            if (product.quantity >= convertWeight * quantity) {
              const newQuantity = product.quantity - convertWeight * quantity
              await Product.findByIdAndUpdate(productInOrder.productId, { quantity: newQuantity });
            } else {
              return {
                code: 400,
                message: `Sản phẩm ${productInOrder.productSnapshot?.name} đã vượt quá số lượng sản phẩm.`
              }
            }
          }
        }
      })
    );

    await order.save()

    const shopAuth: IShop | null = await Shop.findById({ _id: data.shopId })

    if (!shopAuth) {
      throw new Error(`Shop with ID ${data.shopId} not found.`);
    }

    const feePercentage = shopAuth.fee / 100;
    const feeAmount = order.totalAmount * feePercentage;
    const roundedFeeAmount = Math.floor(feeAmount);

    const newFee: IFee = new Fee({
      order_id: order._id,
      feeAmount: roundedFeeAmount,
      status: "pending"
    })

    await newFee.save()


    // Sau khi lưu đơn hàng thành công, bạn có thể tạo một thông báo
    const notificationData = {
      userId: shopAuth.auth,
      content: `Bạn có đơn hàng mới: Đơn hàng #${order._id}`,
      type: 'order',
      status: 'unread',
      orderId: order._id
    };

    const notification = new Notification(notificationData);
    await notification.save();

    return {
      code: 200,
      message: "Tạo đơn hàng thành công"
    }
  } catch (error) {
    console.log(error)
    return {
      code: 500,
      message: "Lỗi hệ thống, vui lòng thử lại"
    }
  }
}

export const getOrders = async ({
  id,
  accessToken,
  role = "individual",
  page = 1,
  perPage = 20
}: IGetOrdersProps): Promise<IOrderResponse> => {
  try {
    await connectToDB();
    const token = await verifyJwtToken(accessToken)

    if (!!token) {
      let query: any = {};

      if (role === "individual") {
        query = { buyerId: id };
      } else if (role === "shop") {
        query = { shopId: id };
      }

      const skip = (page - 1) * perPage;

      const totalItems = await Order.countDocuments(query);

      const totalPages = Math.ceil(totalItems / perPage);

      const orders: IOrder[] = await Order.find(query)
        .skip(skip)
        .limit(perPage)
        .sort({ orderDate: -1 })
        .populate({
          path: 'buyerId',
          select: 'username email image phone',
        })
        .populate({
          path: 'shopId',
          select: 'name image phone',
        })
        .select("_id buyerId shopId totalAmount orderStatus orderDate delivery products");

      if (orders && orders.length > 0) {
        const formattedOrders = orders.map((
          order: IOrder
        ): IOrders => {
          const firstProduct = order.products[0];
          const productSnapshot = firstProduct.productSnapshot;
          const firstImage = productSnapshot.images[0];

          return {
            _id: order._id.toString(),
            buyerId: order.buyerId._id.toString(),
            buyerUsername: order.buyerId.username || order.buyerId.email,
            buyerImage: order.buyerId.image,
            buyerPhone: order.buyerId.phone,
            buyerEmail: order.buyerId.email || "",
            shopId: order.shopId._id.toString(),
            shopPhone: order.shopId.phone,
            shopName: order.shopId.name,
            shopImage: order.shopId.image,
            orderDateConvert: order.orderDate!.toISOString(),
            totalAmount: order.totalAmount,
            status: order.orderStatus,
            productImage: firstImage,
          };
        });
        return {
          code: 200,
          data: JSON.stringify(formattedOrders),
          totalItems,
          totalPages,
        };
      } else {
        return {
          code: 400,
          data: "",
          totalItems: 0,
          totalPages: 0,
        }
      }
    } else {
      return {
        code: 401,
        data: "",
        totalItems: 0,
        totalPages: 0,
      }
    }
  } catch (error) {
    console.log(error)
    return {
      code: 400,
      data: "",
      totalItems: 0,
      totalPages: 0,
    }
  }
}

export const getOrderDetail = async (id: string): Promise<IOrderDetailResponse> => {
  try {
    await connectToDB()

    const order = await Order.findById(id)
      .populate({
        path: 'buyerId',
        select: 'username email image phone',
      })
      .populate({
        path: 'shopId',
        select: 'name shop_id image phone',
      })
    if (order) {
      const fee = await Fee.findOne({ order_id: order._id })
        .select("feeAmount")
      const formattedOrderDetail: IOrderDetail = {
        _id: order._id.toString(),
        buyerId: {
          _id: order.buyerId._id.toString(),
          avatar: order.buyerId.image,
          username: order.buyerId.username,
          email: order.buyerId.email,
          phone: order.buyerId.phone,
        },
        shopId: {
          _id: order.shopId._id.toString(),
          name: order.shopId.name,
          avatar: order.shopId.image,
          phone: order.shopId.phone,
          shop_id: {
            GHN: order.shopId.shop_id.GHN,
            GHTK: order.shopId.shop_id.GHTK
          }
        },
        products: order.products.map((product: IProductOrder) => ({
          productId: product.productId.toString(),
          productSnapshot: {
            name: product.productSnapshot.name,
            images: product.productSnapshot.images,
            retail: product.productSnapshot.retail,
            retailPrice: product.productSnapshot.retailPrice,
            packageOptions: product.productSnapshot.packageOptions,
          },
          quantity: product.quantity,
          unit: product.unit,
          weight: product.weight,
          price: product.price,
          retail: product.retail,
          length: product.length || 0,
          width: product.width || 0,
          height: product.height || 0,
        })),
        totalAmount: order.totalAmount,
        fee: fee.feeAmount || 0,
        orderStatus: order.orderStatus,
        orderDate: order.orderDate!.toISOString(),
        delivery: order.delivery,
        province: order.province,
        district: order.district,
        ward: order.ward,
        apartment: order.apartment
      }

      return {
        code: 200,
        data: JSON.stringify(formattedOrderDetail)
      }

    } else {
      return {
        code: 400,
        message: "Không tìm thấy thông tin đơn hàng",
        data: null
      }
    }
  } catch (error) {
    console.log(error)
    return {
      code: 500,
      message: "Lỗi hệ thống, vui lòng thử lại",
      data: null
    }
  }
}

export const approveOrder = async (token: string, id: string, data: IDeliveryOrderSchema, shop_id: number) => {
  try {
    await connectToDB()
    const verifyToken = verifyJwtToken(token)

    if (!!verifyToken) {
      const order = await Order.findById({ _id: id })

      if (order) {
        const GHNRes: GHNOrderDataResponse = await GHNCreateOrder(data, shop_id)

        if (GHNRes.code === 200) {
          order.shippingCode = GHNRes.data?.order_code
          order.orderStatus = "processed"

          await order.save();

          const notificationData = {
            userId: order.buyerId,
            content: `Đơn hàng của bạn đã được duyệt`,
            type: 'order',
            status: 'unread',
            orderId: order._id
          };

          const notification = new Notification(notificationData);
          await notification.save();

          return {
            code: 200,
            message: "Đơn hàng đã được xử lý và cập nhật thành công.",
          };
        } else {
          return {
            code: 400,
            message: GHNRes.code_message_value || "Lỗi tạo đơn hàng với Giao Hàng Nhanh"
          }
        }
      } else {
        return {
          code: 404,
          message: "Không tìm thấy đơn hàng"
        }
      }
    } else {
      return {
        code: 400,
        message: "Không được phép thực hiện chức năng này, vui lòng đăng nhập và thử lại"
      }
    }
  } catch (error) {
    console.log(error)
    return {
      code: 500,
      message: "Lỗi hệ thống, vui lòng thử lại"
    }
  }
}

export const changeOrderStatus = async (accessToken: string, orderId: string, newStatus: OrderStatus, oldStatus: OrderStatus) => {
  try {
    const token = verifyJwtToken(accessToken)

    if (!!token) {
      const order: IOrder | null = await Order.findById({ _id: orderId })

      if (order) {
        const products = order.products.map(item => {
          let weight = item.weight * item.quantity
          if (item.unit !== "kg") {
            weight = convertToKg(item.weight * item.quantity, item.unit)
          }
          return {
            _id: item.productId,
            weight: weight,
          }
        })

        if (products.length > 0) {
          products.map(async product => {
            const productData: IProduct | null = await Product.findById(product._id)

            if (productData) {
              let sold = productData.sold
              let quantity = productData.quantity

              if (newStatus === "delivered") {
                sold = sold + product.weight
              } else if (newStatus === "canceled" && oldStatus === "delivered") {
                sold = sold - product.weight
              }

              if (newStatus === "canceled") {
                quantity = quantity + product.weight
              }

              await Product.findByIdAndUpdate(product._id, { sold: sold, quantity: quantity })
            } else {
              return {
                code: 404,
                message: "Không tìm thấy sản phẩm"
              }
            }
          })
        } else {
          return {
            code: 404,
            message: "Không có danh sách sản phẩm"
          }
        }

        if (newStatus === "delivered") {
          await Fee.findOneAndUpdate({ order_id: orderId }, { status: "collected" })

        } else if (newStatus === "canceled") {
          if (oldStatus === "delivered") {

          }
          await Fee.findOneAndUpdate({ order_id: orderId }, { status: "canceled" })
        }

        await Order.findByIdAndUpdate({ _id: orderId }, { orderStatus: newStatus })

        const notificationData = {
          userId: order.buyerId,
          content: `${newStatus === "shipped" ? "Đơn hàng của bạn đang được vận chuyển" : newStatus === "delivered" ? "Đơn hàng của bạn đã được giao" : "Đơn hàng của bạn đã bị huỷ"}`,
          type: 'order',
          status: 'unread',
          orderId: order._id
        };

        const notification = new Notification(notificationData);
        await notification.save();

        return {
          code: 200,
          message: "Cập nhật thành công"
        }
      } else {
        return {
          code: 404,
          message: "Không tìm thấy đơn hàng"
        }
      }
    } else {
      return {
        code: 400,
        message: "Không được phép thực hiện chức năng này, vui lòng đăng nhập và thử lại"
      }
    }
  } catch (error) {
    console.log(error)
    return {
      code: 500,
      message: "Lỗi hệ thống, vui lòng thử lại"
    }
  }
}