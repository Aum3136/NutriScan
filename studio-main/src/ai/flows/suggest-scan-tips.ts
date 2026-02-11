'use server';

/**
 * @fileOverview A flow that suggests tips for food scans.
 *
 * - suggestScanTips - A function that returns tips for food scans.
 * - SuggestScanTipsOutput - The return type for the suggestScanTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestScanTipsOutputSchema = z.object({
  tips: z.array(z.string()).describe('An array of tips for food scans.'),
});
export type SuggestScanTipsOutput = z.infer<typeof SuggestScanTipsOutputSchema>;

export async function suggestScanTips(): Promise<SuggestScanTipsOutput> {
  return suggestScanTipsFlow();
}

const prompt = ai.definePrompt({
  name: 'suggestScanTipsPrompt',
  output: {schema: SuggestScanTipsOutputSchema},
  prompt: `You are a helpful assistant that provides tips for food scans.

  Provide a few tips on what types of food scans work best with the NutriScan app. The tips should be helpful and informative, to improve the user experience and the accuracy of the app.

  Example Tips:
  - Scan Indian meals like Dosa, Paneer, Dal
  - Ensure good lighting when scanning.
  - Capture the entire food item in the frame.
  - Try scanning single food items first before mixed dishes.
  - Clean your camera lens for better image quality.
  - Use a plain background to help with food detection.

  Return the tips in JSON format.
  `,
});

const suggestScanTipsFlow = ai.defineFlow(
  {
    name: 'suggestScanTipsFlow',
    outputSchema: SuggestScanTipsOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);
