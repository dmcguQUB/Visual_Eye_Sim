// src/items/items.service.ts

/**
 * Data Model Interfaces
 */
import { BaseItem, Item } from "./item.interface";
import { Items } from "./items.interface";

/**
 * In-Memory Store
 */
 let items: Items =
    [
      {
        id: 1,
        name: "Lizzy Bard",
        imageUrl: "assets/patient-1.jpg",
        age: "70",
        gender: "female",
        medicalHistory: "Hypertension",
        drugInfo: "Aspirin, Irbesartan, Artificial Tears, No drug allergies",
        socialInfo: "Stopped smoking 5 years ago. She has alcohol at Christmas only. Ex-office worker.",
        familyHistory: "Mother had cateracts. Father had lazy eye."
      },
      {
        id: 2,
        name: "Beth Tate",
        imageUrl: "assets/patient-2.jpg",
        age: "70",
        gender: "female",
        medicalHistory: "Hypertension",
        drugInfo: "Aspirin, Irbesartan, Artificial Tears, No drug allergies",
        socialInfo: "Stopped smoking 5 years ago. She has alcohol at Christmas only. Ex-office worker.",
        familyHistory: "Mother had cateracts. Father had lazy eye."
      },
      {
        id: 3,
        name: "Frank Howard",
        imageUrl: "assets/patient-3.jpg",
        age: "70",
        gender: "female",
        medicalHistory: "Hypertension",
        drugInfo: "Aspirin, Irbesartan, Artificial Tears, No drug allergies",
        socialInfo: "Stopped smoking 5 years ago. She has alcohol at Christmas only. Ex-office worker.",
        familyHistory: "Mother had cateracts. Father had lazy eye."
      }
    ]
    


/**
 * Service Methods
 */

//find all
export const findAll = async (): Promise<Item[]> => Object.values(items);

//find
export const find = async (id: number): Promise<Item> => items[id];

//create
export const create = async (newItem: BaseItem): Promise<Item> => {
  const id = new Date().valueOf();

  items[id] = {
    id,
    ...newItem,
  };

  return items[id];
};

//update
export const update = async (
  id: number,
  itemUpdate: BaseItem
): Promise<Item | null> => {
  const item = await find(id);

  if (!item) {
    return null;
  }

  items[id] = { id, ...itemUpdate };

  return items[id];
};

//remove
export const remove = async (id: number): Promise<null | void> => {
  const item = await find(id);

  if (!item) {
    return null;
  }

  delete items[id];
};