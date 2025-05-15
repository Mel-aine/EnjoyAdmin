// menu/index.ts (ou où tu déclares cette fonction)
import { getHotelMenu } from './hotel';
import { getRestaurantMenu } from './restaurant';
import {getBusAgencyMenu} from './travel'

// export const getMenuByCategoryName = (categoryName: string | null) => {
//   if (!categoryName) return [];

//   const lowerName = categoryName.toLowerCase();

//   if (lowerName.includes('hotel')) {
//     return getHotelMenu();
//   }

//   if (lowerName.includes('restaurant')) {
//     return getRestaurantMenu();
//   }

//   return [];
// };
export const getMenuByCategoryName = (
  categoryName: string | null,
  t: (key: string) => string
) => {
  if (!categoryName) return [];

  const lowerName = categoryName.toLowerCase();

  if (lowerName.includes('hotel')) {
    return getHotelMenu(t);
  }

  // if (lowerName.includes('restaurant')) {
  //   return getRestaurantMenu(t);
  // }
  if (lowerName.includes('restaurant')) {
    return getBusAgencyMenu(t);
  }

  return [];
};
