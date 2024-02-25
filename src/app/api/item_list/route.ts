import { DBm } from "@/store"
import { cookies } from "next/headers"

export async function GET() {
  const ITEMSDB = DBm.ITEMS
  const cookieStore = cookies()
  const itemsStore = cookieStore.get('items')

  if (itemsStore) {
    return new Response(JSON.stringify({ results: JSON.parse(itemsStore.value) }))
  } else {
    cookieStore.set('items', JSON.stringify(ITEMSDB))
    return new Response(JSON.stringify({ results: ITEMSDB }))
  }

}