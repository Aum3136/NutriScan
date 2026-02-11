'use server';

/**
 * @fileOverview An AI agent for identifying food items in an image.
 *
 * - identifyFoodItem - A function that handles the food identification process.
 * - IdentifyFoodItemInput - The input type for the identifyFoodItem function.
 * - IdentifyFoodItemOutput - The return type for the identifyFoodItem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyFoodItemInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a food item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyFoodItemInput = z.infer<typeof IdentifyFoodItemInputSchema>;

const IdentifyFoodItemOutputSchema = z.object({
  foodName: z.string().describe('The name of the identified food item.'),
  triggerNutritionalAnalysis: z.boolean().describe('Whether the identified food item should trigger nutritional analysis.'),
});
export type IdentifyFoodItemOutput = z.infer<typeof IdentifyFoodItemOutputSchema>;

export async function identifyFoodItem(input: IdentifyFoodItemInput): Promise<IdentifyFoodItemOutput> {
  return identifyFoodItemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyFoodItemPrompt',
  input: {schema: IdentifyFoodItemInputSchema},
  output: {schema: IdentifyFoodItemOutputSchema},
  prompt: `You are an AI assistant specialized in identifying food items from images.

  Given an image of a food item, identify the food item and determine if nutritional analysis should be triggered.

  Here is the image of the food item: {{media url=photoDataUri}}
  Respond with the food name and whether nutritional analysis should be triggered.
  `,
});

const identifyFoodItemFlow = ai.defineFlow(
  {
    name: 'identifyFoodItemFlow',
    inputSchema: IdentifyFoodItemInputSchema,
    outputSchema: IdentifyFoodItemOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
