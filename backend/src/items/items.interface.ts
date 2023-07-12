//backend/src/items/item.interface.ts
import { Item } from "./item.interface";

export interface Items {
  [key: number]: Item;
}