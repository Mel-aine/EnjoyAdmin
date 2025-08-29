// menu/index.ts (ou où tu déclares cette fonction)
import { getHotelMenu } from './hotel';



export const getMenuByCategoryName = (
  categoryName: string | null,
  t: (key: string) => string
) => {
  if (!categoryName) return [];

  const lowerName = categoryName.toLowerCase();

  if (lowerName.includes('hotel')) {
    return getHotelMenu(t);
  }

  return [];
};
