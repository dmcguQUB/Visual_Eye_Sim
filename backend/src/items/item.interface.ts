//backend/src/items/item.interface.ts
export interface BaseItem {
  name: string,
  imageUrl: string,
  age: string,
  gender: string,
  medicalHistory: string,
  drugInfo: string,
  socialInfo: string,
  familyHistory: string
}

export interface Item extends BaseItem {
  id: number;
}
