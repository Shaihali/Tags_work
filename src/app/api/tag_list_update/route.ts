import { ResultItem, Tag } from "@/types";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const res = await request.json()
  const cookieStore = cookies();
  const tagsStore = cookieStore.get('tags');
  const itemsStore = cookieStore.get('items')

  if (tagsStore && itemsStore) {
    const itemList: ResultItem[] = JSON.parse(itemsStore.value)
    const updatedTagsList: Tag[] = res.state;

    const updateItem = itemList.map((item) => {
      if (item.id === res.item.id) {
        return res.item
      }
      return item

    })
    cookieStore.set('tags', JSON.stringify(updatedTagsList));
    cookieStore.set('items', JSON.stringify(updateItem));
  }
  return Response.json({ res })
}