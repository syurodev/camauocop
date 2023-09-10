import { getSimilarProducts } from "@/actions/recommendation";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await getSimilarProducts(params.id);
  return new Response(JSON.stringify(data));
}
