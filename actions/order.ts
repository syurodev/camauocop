"use server"

import Notification, { INotification } from "@/lib/models/notification";
import Order from "@/lib/models/orders"
import Product from "@/lib/models/products";
import Shop, { IShop } from "@/lib/models/shop";
import { connectToDB, verifyJwtToken } from "@/lib/utils";
import { IOrderZodSchema } from "@/lib/zodSchema/order"

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
    await order.save()

    const shopAuth: IShop | null = await Shop.findById({ _id: data.shopId })

    if (!shopAuth) {
      throw new Error(`Shop with ID ${data.shopId} not found.`);
    }

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
          select: 'username email',
        })
        .populate({
          path: 'shopId',
          select: 'name',
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
            buyerId: {
              _id: order.buyerId._id.toString(),
              username: order.buyerId.username || "",
              email: order.buyerId.email || ""
            },
            shopId: {
              _id: order.shopId._id.toString(),
              name: order.shopId.name
            },
            orderDateConvert: order.orderDate!.toISOString(),
            totalAmount: order.totalAmount,
            orderStatus: order.orderStatus,
            productImage: firstImage,
          };
        });
        return {
          code: 200,
          data: formattedOrders,
          totalItems,
          totalPages,
        };
      } else {
        return {
          code: 400,
          data: [],
          totalItems: 0,
          totalPages: 0,
        }
      }
    } else {
      return {
        code: 401,
        data: [],
        totalItems: 0,
        totalPages: 0,
      }
    }
  } catch (error) {
    console.log(error)
    return {
      code: 400,
      data: [],
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
        select: 'name shop_id',
        populate: {
          path: "auth",
          select: "username email image phone",
        }
      })

    if (order) {
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
          shop_id: {
            GHN: order.shopId.shop_id.GHN,
            GHTK: order.shopId.shop_id.GHTK
          },
          auth: {
            username: order.shopId.auth.username,
            avatar: order.shopId.auth.image,
            _id: order.shopId.auth._id.toString(),
            phone: order.shopId.auth.phone,
            email: order.shopId.auth.email
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
        data: formattedOrderDetail
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