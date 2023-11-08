"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { connectToDB, verifyJwtToken } from "@/lib/utils";
import Product, { IProduct } from "@/lib/models/products";
import Favorite, { IFavorite } from "@/lib/models/favorites";
import ProductType from "@/lib/models/productTypes";
import { type IAddProductZodSchema } from "@/lib/zodSchema/products";
import { type IAddProductTypeZodSchema } from "@/lib/zodSchema/products";
import { convertToKg } from "@/lib/convertToKg";
import Cart, { ICart } from "@/lib/models/carts"

type Product = {
  _id: ObjectId;
  name: string;
  retailPrice: number;
  specialty: boolean;
  images: string[];
  packageOptions: {
    unit: string;
    weight: number;
    price: number;
    length: number;
    width: number;
    height: number;
  }[];
};

export async function addProduct(data: string) {
  try {
    await connectToDB();
    const req: IAddProductZodSchema = JSON.parse(data);

    const product = new Product(req);
    const quantity = convertToKg(product.quantity, req.unit)
    product.quantity = quantity

    await product.save();
    return {
      code: 200,
      message: `Thêm sản phẩm ${product.name} thành công`
    }
  } catch (error) {
    console.log(error);
    return {
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại"
    }
  }
}

export async function getProductTypes() {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);

    if (session) {
      const productTypes: IAddProductTypes[] = await ProductType.find({
        shopId: session?.user.shopId,
      });

      if (productTypes.length > 0) {
        const formattedProductTypes = productTypes.map((type) => ({
          _id: type._id.toString(),
          name: type.name,
        }));

        return formattedProductTypes;
      } else {
        return [];
      }
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function addProductType(data: IAddProductTypeZodSchema) {
  try {
    await connectToDB();

    const exittedProductType = await ProductType.findOne({
      shopId: data.shopId,
      name: { $regex: new RegExp(data.name, "i") },
    });

    if (exittedProductType) {
      return { satus: false, message: "Loại hàng hoá đã tồn tại" };
    }

    const nerProductType = new ProductType(data);
    await nerProductType.save();

    const formattedNewProductType = {
      _id: nerProductType._id.toString(),
      name: nerProductType.name,
    };

    revalidatePath("/products/product/add");
    return {
      satus: true,
      message: "Thêm loại hàng hoá thành công",
      newProductType: formattedNewProductType,
    };
  } catch (error) {
    console.log(error);
    return {
      satus: false,
      message: "Có lỗi trong quá trình thêm loại hàng hoá. Vui lòng thử lại",
    };
  }
}

export async function getProducts(
  page: number = 1,
  limitItems: number = 12,
  shopId?: string,
  deleted: boolean = false,
): Promise<IProductsResponse> {
  try {
    await connectToDB();
    const limit = limitItems;
    const skip = (page - 1) * limit;

    let query: any = { deleted: deleted };

    if (shopId) {
      query = { ...query, shopId: shopId };
    }

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    const products: Product[] = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("name images retailPrice specialty packageOptions");

    if (products && products.length > 0) {
      // Format the data
      const formattedProducts = products.map(
        (product: Product): IProducts => {
          let productPrice = product.retailPrice;
          if (!productPrice || productPrice === 0) {
            const minPrice = Math.min(
              ...product.packageOptions.map((option) => option.price)
            );
            productPrice = minPrice;
          }

          return {
            _id: product._id?.toString(),
            productName: product.name,
            productImages: product.images,
            productPrice: productPrice,
            specialty: product.specialty,
          };
        }
      );
      return {
        products: formattedProducts,
        totalPages,
      };
    } else {
      return {
        products: [],
        totalPages: 0,
      };
    }
  } catch (error) {
    console.log("Lỗi lấy danh sách sản phẩm mới:", error);
    return {
      products: [],
      totalPages: 0,
    };
  }
}

export async function getProductDetail(_id: string | string[], userId?: string): Promise<IProductDetail | IProductDetail[] | null> {
  try {
    const query = Array.isArray(_id) ? { _id: { $in: _id } } : { _id: _id };

    await connectToDB();

    if (Array.isArray(_id)) {
      const products = await Product.find(query)
        .populate({
          path: "shopId",
          select: "name _id phone delivery status image shop_id address",
        })
        .populate({
          path: "productType",
          select: "name _id",
        });

      const formattedProducts: IProductDetail[] = products.map((product) => {
        return {
          _id: product._id.toString(),
          productName: product.name,
          productDescription: product.description,
          retail: product.retail,
          packageOptions: product.packageOptions,
          productPrice: product.retailPrice,
          productSold: product.sold || 0,
          productQuantity: product.quantity,
          productImages: product.images,
          productCreatedAt: product.createdAt,
          productDeletedAt: product.deleteAt,
          specialty: product.specialty,
          shopId: product.shopId._id.toString() || "",
          productTypeName: product.productType.name.toString(),
          productTypeId: product.productType._id.toString(),
          shopInfo: {
            delivery: product.shopId.delivery,
            address: product.shopId.address,
            shop_id: product.shopId.shop_id,
            name: product.shopId.name,
            status: product.shopId.status,
            phone: product.shopId.phone,
            image: product.shopId.image || "",
          },
        };
      });
      return formattedProducts;
    } else {
      const product = await Product.findById(query)
        .populate({
          path: "shopId",
          select: "name _id phone delivery status image shop_id address",
        })
        .populate({
          path: "productType",
          select: "name _id",
        });

      if (!product) {
        return null;
      }

      let isFavorite = false;
      if (userId) {
        const favorite: IFavorite | null = await Favorite.findOne({ userId });
        if (favorite) {
          isFavorite = favorite.products.some((favoriteProduct) => favoriteProduct.productId.toString() === _id);
        }
      }

      // Format the data
      const formattedProduct: IProductDetail = {
        _id: product._id.toString(),
        productName: product.name,
        productDescription: product.description,
        retail: product.retail,
        packageOptions: product.packageOptions,
        productPrice: product.retailPrice,
        productSold: product.sold || 0,
        productQuantity: product.quantity,
        specialty: product.specialty,
        productImages: product.images,
        productCreatedAt: product.createdAt,
        productDeletedAt: product.deleteAt,
        shopId: product.shopId._id.toString() || "",
        productTypeName: product.productType.name.toString(),
        productTypeId: product.productType._id.toString(),
        shopInfo: {
          delivery: product.shopId.delivery,
          address: product.shopId.address,
          status: product.shopId.status,
          shop_id: product.shopId.shop_id,
          name: product.shopId.name,
          phone: product.shopId.phone,
          image: product.shopId.image
        },
        isFavorite
      };

      return formattedProduct;
    }

  } catch (error) {
    console.log("Lỗi lấy chi tiết sản phẩm", error);
    return null;
  }
}

export async function searchProducts(
  slug: string,
  page: number,
  filter: Filter
): Promise<IProductsResponse> {
  try {
    await connectToDB();

    const productTypes = await ProductType.find({
      name: { $regex: slug, $options: "i" },
    });

    if (!productTypes || productTypes.length === 0) {
      return {
        products: [],
        totalPages: 0,
      };
    }

    const productTypeIds = productTypes.map((productType) => productType._id);

    const limit = 20;
    const skip = (page - 1) * limit;

    const query: any = {
      $or: [
        { productType: { $in: productTypeIds } },
        { name: { $regex: slug, $options: "i" } },
      ],
      deleted: false
    }

    const sortOptions: any = {
      $sort: { sold: -1 },
    };

    if (filter.price === "low") {
      sortOptions.$sort = { minPrice: 1 };
    } else if (filter.price === "hight") {
      sortOptions.$sort = { minPrice: -1 };
    }

    const products: Product[] = await Product.aggregate([
      {
        $match: query,
      },
      {
        $addFields: {
          minPrice: {
            $min: {
              $cond: [
                { $eq: ["$retailPrice", 0] },
                { $map: { input: "$packageOptions", in: "$$this.price" } },
                ["$retailPrice"],
              ],
            },
          },
        },
      },
      {
        $sort: sortOptions.$sort,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 1,
          name: 1,
          images: 1,
          retailPrice: {
            $cond: [
              { $eq: ["$retailPrice", 0] },
              "$minPrice",
              "$retailPrice",
            ],
          },
          specialty: 1,
          packageOptions: 1,
        },
      },
    ]);

    if (products && products.length > 0) {
      // Format the data
      const formattedProducts = products.map(
        (product: Product): IProducts => {
          let productPrice = product.retailPrice;
          if (!productPrice || productPrice === 0) {
            const minPrice = Math.min(
              ...product.packageOptions.map((option) => option.price)
            );
            productPrice = minPrice;
          }

          return {
            _id: product._id?.toString(),
            productName: product.name,
            productImages: product.images,
            productPrice: productPrice,
            specialty: product.specialty,
          };
        }
      );

      const totalProducts = await Product.countDocuments({
        productType: { $in: productTypeIds },
      });

      const totalPages = Math.ceil(totalProducts / limit);
      return {
        products: formattedProducts,
        totalPages,
      };
    } else {
      return {
        products: [],
        totalPages: 0,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      products: [],
      totalPages: 0,
    };
  }
}

export async function setFavorite(
  userId: string,
  productId: string,
  accessToken: string
) {
  try {
    await connectToDB();

    const token = verifyJwtToken(accessToken)
    if (!!token) {
      const existingFavorite: IFavorite | null = await Favorite.findOne({ userId: userId });

      if (existingFavorite) {
        // Danh sách yêu thích của người dùng đã tồn tại
        const favoriteProducts = existingFavorite.products;
        const index = favoriteProducts.findIndex((item) => item.productId.toString() === productId);

        if (index === -1) {
          // Nếu productId chưa tồn tại, thêm nó vào danh sách
          favoriteProducts.push({ productId, addedDate: new Date() });
        } else {
          // Nếu productId đã tồn tại, xoá nó khỏi danh sách
          favoriteProducts.splice(index, 1);
        }

        // Cập nhật danh sách yêu thích
        existingFavorite.products = favoriteProducts;
        await existingFavorite.save();
      } else {
        // Danh sách yêu thích của người dùng chưa tồn tại
        const newFavorite = new Favorite({
          userId: userId,
          products: [{ productId, addedDate: new Date() }],
        });
        await newFavorite.save();
      }

      return {
        code: 200,
        message: 'Đã thực hiện thay đổi trong danh sách yêu thích',
      };
    } else {
      return {
        code: 401,
        message: "Bạn không có quyền thực chức năng này, vui lòng đăng nhập và thử lại"
      }
    }

  } catch (error) {
    console.log(error)
    return {
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại"
    }
  }
}

export async function editProduct(id: string, data: IAddProductZodSchema, accessToken: string) {
  try {
    const token = verifyJwtToken(accessToken);
    if (!!token) {
      await connectToDB();
      const product: IProduct | null = await Product.findById(id);

      if (product) {
        product.productType = data?.productType || product?.productType
        product.name = data?.name || product?.name!
        product.description = data?.description || product?.description
        product.retailPrice = data?.retailPrice || product?.retailPrice
        product.retail = data?.retail || product?.retail
        product.packageOptions = data?.packageOptions || product?.packageOptions
        product.images = data?.images || product?.images
        if (data.unit === "kg") {
          product.quantity = data?.quantity || product?.quantity
        } else {
          product.quantity = convertToKg(data?.quantity, data?.unit) || product?.quantity
        }

        await product.save()

        return {
          code: 200,
          message: "Sản phẩm đã được cập nhật"
        }
      } else {
        return {
          code: 400,
          message: "Không tìm thấy sản phẩm"
        }
      }
    } else {
      return {
        code: 401,
        message: "Bạn không có quyền thực chức năng này, vui lòng đăng nhập và thử lại"
      }
    }
  } catch (error) {
    console.log(error)
    return {
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại"
    }
  }
}

export async function deleteProduct(id: string, accessToken: string) {
  try {
    const token = verifyJwtToken(accessToken);
    if (!!token) {
      await connectToDB();
      const product: IProduct | null = await Product.findById(id);
      if (product) {
        product.deleted = true;
        product.deleteAt = new Date();
        await product.save();
        return {
          code: 200,
          message: "Sản phẩm đã được xóa"
        }
      } else {
        return {
          code: 400,
          message: "Không tìm thấy sản phẩm"
        }
      }
    } else {
      return {
        code: 401,
        message: "Bạn không có quyền thực chức năng này, vui lòng đăng nhập và thử lại"
      }
    }
  } catch (e) {
    console.log(e)
    return {
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại"
    }
  }
}

export async function addToCard(productId: string, userId: string, accessToken: string) {
  try {
    const token = verifyJwtToken(accessToken)

    if (!!token) {
      await connectToDB()

      const existingCart: ICart | null = await Cart.findOne({ userId: userId });

      if (existingCart) {
        // Danh sách yêu thích của người dùng đã tồn tại
        const cartProducts = existingCart.products;
        const index = cartProducts.findIndex((item) => item.productId.toString() === productId);

        if (index === -1) {
          // Nếu productId chưa tồn tại, thêm nó vào danh sách
          cartProducts.push({ productId, addedDate: new Date() });
        } else {
          return {
            code: 202,
            message: "Sản phẩm đã được thêm vào giỏ hàng"
          }
        }

        // Cập nhật danh sách yêu thích
        existingCart.products = cartProducts;
        await existingCart.save();

        return {
          code: 200,
          message: "Sản phẩm đã được thêm vào giỏ hàng"
        }
      } else {
        // Danh sách yêu thích của người dùng chưa tồn tại
        const newCart = new Cart({
          userId: userId,
          products: [{ productId, addedDate: new Date() }],
        });
        await newCart.save();

        return {
          code: 200,
          message: "Sản phẩm đã được thêm vào giỏ hàng"
        }
      }
    } else {
      return {
        code: 400,
        message: "Bạn không có quyền thực chức năng này, vui lòng đăng nhập và thử lại"
      }
    }
  } catch (error) {
    console.log(error)
    return {
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại"
    }
  }
}

export async function getProductsSpecialty(
  slug: string,
  page: number = 1,
  limitItems: number = 24,
  filter: Filter
) {
  try {
    await connectToDB();
    const limit = limitItems;
    const skip = (page - 1) * limit;

    let query: any = { deleted: false, specialty: true };

    if (slug && slug !== "all") {
      query = { ...query, $expr: { $eq: ['$specialtyId', { $toObjectId: slug }] } };
    }

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    const sortOptions: any = {
      $sort: { sold: -1 },
    };

    if (filter.price === "low") {
      sortOptions.$sort = { minPrice: 1 };
    } else if (filter.price === "hight") {
      sortOptions.$sort = { minPrice: -1 };
    }

    const products: Product[] = await Product.aggregate([
      {
        $match: query,
      },
      {
        $addFields: {
          minPrice: {
            $min: {
              $cond: [
                { $eq: ["$retailPrice", 0] },
                { $map: { input: "$packageOptions", in: "$$this.price" } },
                ["$retailPrice"],
              ],
            },
          },
        },
      },
      {
        $sort: sortOptions.$sort,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 1,
          name: 1,
          images: 1,
          retailPrice: {
            $cond: [
              { $eq: ["$retailPrice", 0] },
              "$minPrice",
              "$retailPrice",
            ],
          },
          specialty: 1,
          packageOptions: 1,
        },
      },
    ]);

    if (products && products.length > 0) {
      const formattedProducts = products.map((product) => {
        let productPrice = product.retailPrice;
        if (!productPrice || productPrice === 0) {
          const minPrice = Math.min(
            ...product.packageOptions.map((option) => option.price)
          );
          productPrice = minPrice;
        }

        return {
          _id: product._id.toString(),
          productName: product.name,
          productImages: product.images,
          productPrice: productPrice,
          specialty: product.specialty,
        };
      });

      return {
        products: formattedProducts,
        totalPages,
      };
    } else {
      return {
        products: [],
        totalPages: 0,
      };
    }
  } catch (error) {
    return {
      products: [],
      totalPages: 0,
    };
  }
}
