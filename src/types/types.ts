export type Tag = {
  id: string;
  name: string;
  color: string;
  order: number;
}

export type ResultItem = {
  id: string;
  tag_ids: string[];
}

export type Item = {
  id: string;
  tag_ids: Tag[];
}

export type DB = {
  TAGS: Tag[];
  ITEMS: ResultItem[]
}

export type RequestGetItem = {
  results: ResultItem[]
}
export type RequestGetTag = {
  results: Tag[]
}