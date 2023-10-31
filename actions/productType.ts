"use server";
import Product from "@/lib/models/products";

export interface ProductTypesResponse {
  totalSold: number,
  typeName: string
}

export async function getProductTypes() {
  try {
    const data: ProductTypesResponse[] = await Product.aggregate([
      {
        $lookup: {
          from: "producttypes",
          localField: "productType",
          foreignField: "_id",
          as: "productType",
        },
      },
      {
        $unwind: "$productType",
      },
      {
        $group: {
          _id: "$productType.name",
          totalSold: { $sum: "$sold" },
        },
      },
      {
        $sort: { totalSold: -1 },
      },
      {
        $project: {
          _id: 0,
          typeName: "$_id",
          totalSold: 1,
        },
      },
    ]);

    if (data.length > 0) {
      return {
        code: 200,
        data: data
      };
    } else {

      return {
        code: 400,
        data: []
      };
    }
  } catch (error) {
    console.log(error);
    return {
      code: 500,
      data: []
    };
  }
}
