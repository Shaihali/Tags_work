import { ResultItem, Tag } from "@/types";
import { cookies } from "next/headers"

export async function POST(request: Request) {
  const res = await request.json()
  const cookieStore = cookies();
  const tagsStore = cookieStore.get('tags');
  if (tagsStore) {
    const tagsList = JSON.parse(tagsStore.value);
    tagsList.push(res)
    cookieStore.set('tags', JSON.stringify(tagsList))
  }

  return Response.json({ res })
}

export async function PATCH(request: Request) {
  const res = await request.json()
  const cookieStore = cookies();
  const tagsStore = cookieStore.get('tags');
  if (tagsStore) {
    const tagsList = JSON.parse(tagsStore.value);
    const updateTag = tagsList.map((tag: Tag) => {
      if (tag.id === res.id) {
        return res;
      }
      return tag;
    });

    cookieStore.set('tags', JSON.stringify(updateTag))
  }

  return Response.json({ res })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const paramsId = searchParams.get('id');
  const cookieStore = cookies();
  const tagsStore = cookieStore.get('tags');
  const itemsStore = cookieStore.get('items')
  if (tagsStore && itemsStore) {
    const tagsList = JSON.parse(tagsStore.value)
    const itemsList = JSON.parse(itemsStore.value)
    const updateTagList = tagsList.filter((tag: Tag) => tag.id !== paramsId)
    updateTagList.forEach((tag: Tag, i: number) => tag.order = i)
    const filteredItem = itemsList.map((item: ResultItem) => ({
      id: item.id,
      tag_ids: item.tag_ids.filter((tagId) => tagId !== paramsId)
    }))

    cookieStore.set('tags', JSON.stringify(updateTagList))
    cookieStore.set('items', JSON.stringify(filteredItem))
  }

  return Response.json({ paramsId })
}