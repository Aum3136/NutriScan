export type NutritionalInfo = {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

export type Scan = {
  id: string;
  foodName: string;
  imageUrl: string;
  nutritionalInfo: NutritionalInfo;
  createdAt: string;
};

export type Settings = {
  theme: "light" | "dark" | "system";
  units: "grams" | "ounces";
};
