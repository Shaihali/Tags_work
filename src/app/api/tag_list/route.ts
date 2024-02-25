import { DBm } from "@/store"
import { cookies } from "next/headers"

export async function GET() {
  const TAGSDB = DBm.TAGS;
  const cookieStore = cookies()
  const tagsStore = cookieStore.get('tags')

  if (tagsStore) {
    return new Response(JSON.stringify({ results: JSON.parse(tagsStore.value) }))
  } else {
    cookieStore.set('tags', JSON.stringify(TAGSDB))
    return new Response(JSON.stringify({ results: TAGSDB }))
  }
}