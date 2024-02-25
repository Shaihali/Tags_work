import { DB } from "@/types";

export const DBm: DB = {
  TAGS: [
    { id: '1', name: 'Тег 1', color: 'var(--color-blue)', order: 0 },
    { id: '2', name: 'очень длинный текст', color: 'var(--color-green)', order: 1 },
    { id: '3', name: 'Тег 6', color: 'var(--color-orange)', order: 2 }
  ],

  ITEMS: [
    { id: '1', tag_ids: ['1', '2'] },
    { id: '2', tag_ids: ['2'] },
    { id: '3', tag_ids: [] },
    { id: '4', tag_ids: ['3', '2', '1'] },
  ]
}

