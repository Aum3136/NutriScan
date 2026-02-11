"use server";

import { identifyFoodItem } from "@/ai/flows/identify-food-item";
import { Scan, NutritionalInfo } from "@/lib/types";

function createMockNutritionalInfo(foodName: string): NutritionalInfo {
  const baseCalories = (foodName.length * 15) % 250 + 100; // 100-350
  const calories = Math.floor(Math.random() * 100) + baseCalories;
  const protein = Math.floor(Math.random() * 20) + 5; // 5-25g
  const carbs = Math.floor(Math.random() * 40) + 10; // 10-50g
  const fats = Math.floor(Math.random() * 15) + 5; // 5-20g
  return { calories, protein, carbs, fats };
}

export async function analyzeImage(photoDataUri: string): Promise<{ scan?: Scan; error?: string }> {
  try {
    const result = await identifyFoodItem({ photoDataUri });

    if (!result.foodName) {
      return { error: "Could not identify the food item. Please try another image." };
    }

    if (result.triggerNutritionalAnalysis) {
      const nutritionalInfo = createMockNutritionalInfo(result.foodName);
      const newScan: Scan = {
        id: crypto.randomUUID(),
        foodName: result.foodName,
        imageUrl: photoDataUri,
        nutritionalInfo,
        createdAt: new Date().toISOString(),
      };
      return { scan: newScan };
    } else {
        return { error: `We've identified this as ${result.foodName}, but nutritional analysis is not available for it.` };
    }

  } catch (error) {
    console.error("Error analyzing image:", error);
    return { error: "An unexpected error occurred during analysis. Please try again." };
  }
}
