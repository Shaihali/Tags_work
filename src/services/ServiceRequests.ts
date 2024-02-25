import { RequestGetItem, RequestGetTag } from "@/types";
import axios from "axios";

export const ServiceRequests = {
  getItems: async () => await axios.get<RequestGetItem>("api/item_list"),
  getTags: async () => await axios.get<RequestGetTag>('api/tag_list')
}