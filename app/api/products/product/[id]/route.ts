import Product, { IProduct } from "@/lib/models/products";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const product: IProduct | null = await Product.findById({ _id: params.id })

  if (!product) {
    return new Response(JSON.stringify({ error: "Product not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(product));
}