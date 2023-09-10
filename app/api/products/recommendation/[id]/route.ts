import { getSimilarProducts } from "@/actions/recommendation";

export async function GET({ params }: { params: { id: string } }) {
  const data = await getSimilarProducts(params.id);
  return new Response(JSON.stringify(data));
}
