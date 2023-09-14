"use server";
import Product from "@/lib/models/products";
import ProductType from "@/lib/models/productTypes";

export async function getTopProductType() {
  try {
    const data = await Product.aggregate([
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
      return data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}
