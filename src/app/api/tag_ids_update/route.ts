import { DBm } from "@/store"
import { Item } from "@/types";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const res = await request.json()
  const cookieStore = cookies();
  const itemsStore = cookieStore.get('items');

  if (itemsStore) {
    const itemsList: Item[] = JSON.parse(itemsStore.value)
    // const index = itemsList.findIndex((item) => item.id === res.item_id);
    // if (index !== -1) {
    //   itemsList[index].tag_ids.push(...res.tags_id)
    //   cookieStore.set('items', JSON.stringify(itemsList))
    // }
    const updatedItems = itemsList.map((item) => {
      if (item.id === res.item_id) {
        return {
          ...item,
          tag_ids: res.tag_ids,
        };
      }
      return item;
    });

    console.log(updatedItems);
    cookieStore.set('items', JSON.stringify(updatedItems));
  }
  return Response.json({ res })
}