'use server';

/**
 * @fileOverview AI-powered tool that adjusts rental pricing based on real-time demand, weather conditions, and e-bike availability.
 *
 * - adjustRentalPrice - A function that handles the dynamic pricing adjustment process.
 * - AdjustRentalPriceInput - The input type for the adjustRentalPrice function.
 * - AdjustRentalPriceOutput - The return type for the adjustRentalPrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustRentalPriceInputSchema = z.object({
  currentDemand: z
    .string()
    .describe("The current demand for e-bikes (e.g., 'high', 'medium', 'low')."),
  weatherCondition: z
    .string()
    .describe("The current weather condition (e.g., 'sunny', 'rainy', 'cloudy')."),
  eBikeAvailability: z
    .string()
    .describe("The availability of e-bikes (e.g., 'high', 'medium', 'low')."),
  basePrice: z.number().describe('The base rental price.'),
});
export type AdjustRentalPriceInput = z.infer<typeof AdjustRentalPriceInputSchema>;

const AdjustRentalPriceOutputSchema = z.object({
  adjustedPrice: z
    .number()
    .describe('The adjusted rental price based on demand, weather, and availability.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the price adjustment.'),
});
export type AdjustRentalPriceOutput = z.infer<typeof AdjustRentalPriceOutputSchema>;

export async function adjustRentalPrice(
  input: AdjustRentalPriceInput
): Promise<AdjustRentalPriceOutput> {
  return adjustRentalPriceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adjustRentalPricePrompt',
  input: {schema: AdjustRentalPriceInputSchema},
  output: {schema: AdjustRentalPriceOutputSchema},
  prompt: `You are an AI-powered dynamic pricing tool for e-bike rentals.  Given the current demand, weather conditions, e-bike availability, and base price, you will determine the optimal rental price to maximize revenue and balance e-bike utilization.

  Current Demand: {{{currentDemand}}}
  Weather Condition: {{{weatherCondition}}}
  E-Bike Availability: {{{eBikeAvailability}}}
  Base Price: {{{basePrice}}}

  Consider the following factors when adjusting the price:
  - High demand should increase the price.
  - Rainy weather should decrease the price to incentivize rentals.
  - Low e-bike availability should increase the price.

  Output the adjusted price and the reasoning behind the adjustment. The adjusted price should be a number, do not include currency symbols.
  `,
});

const adjustRentalPriceFlow = ai.defineFlow(
  {
    name: 'adjustRentalPriceFlow',
    inputSchema: AdjustRentalPriceInputSchema,
    outputSchema: AdjustRentalPriceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
