'use server';
/**
 * @fileOverview This file defines a Genkit flow for predicting e-bike maintenance needs.
 *
 * - predictEBikeMaintenance - A function that predicts when an e-bike will require maintenance.
 * - PredictEBikeMaintenanceInput - The input type for the predictEBikeMaintenance function.
 * - PredictEBikeMaintenanceOutput - The return type for the predictEBikeMaintenance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictEBikeMaintenanceInputSchema = z.object({
  usagePatterns: z.string().describe('E-bike usage patterns, such as daily mileage, average speed, and usage frequency.'),
  sensorData: z.string().describe('Sensor data from the e-bike, including battery health, motor temperature, and tire pressure.'),
  historicalMaintenanceRecords: z.string().describe('Historical maintenance records for the e-bike, including dates of service, repairs performed, and parts replaced.'),
});
export type PredictEBikeMaintenanceInput = z.infer<typeof PredictEBikeMaintenanceInputSchema>;

const PredictEBikeMaintenanceOutputSchema = z.object({
  predictedMaintenanceDate: z.string().describe('The predicted date when the e-bike will require maintenance, in ISO 8601 format (YYYY-MM-DD).'),
  maintenanceRecommendations: z.string().describe('Specific maintenance recommendations based on the analysis of usage patterns, sensor data, and historical maintenance records.'),
  confidenceLevel: z.number().describe('A numerical value (0-1) indicating the confidence level of the prediction, where 1 is highest confidence.'),
});
export type PredictEBikeMaintenanceOutput = z.infer<typeof PredictEBikeMaintenanceOutputSchema>;

export async function predictEBikeMaintenance(input: PredictEBikeMaintenanceInput): Promise<PredictEBikeMaintenanceOutput> {
  return predictEBikeMaintenanceFlow(input);
}

const predictEBikeMaintenancePrompt = ai.definePrompt({
  name: 'predictEBikeMaintenancePrompt',
  input: {schema: PredictEBikeMaintenanceInputSchema},
  output: {schema: PredictEBikeMaintenanceOutputSchema},
  prompt: `You are an expert in predicting e-bike maintenance needs.
  Analyze the provided data to predict the next maintenance date and provide recommendations.

  Usage Patterns: {{{usagePatterns}}}
  Sensor Data: {{{sensorData}}}
  Historical Maintenance Records: {{{historicalMaintenanceRecords}}}

  Based on this information, predict the date when the e-bike will require maintenance, provide specific maintenance recommendations, and indicate the confidence level of your prediction.
  Format the predicted maintenance date in ISO 8601 format (YYYY-MM-DD).
`,
});

const predictEBikeMaintenanceFlow = ai.defineFlow(
  {
    name: 'predictEBikeMaintenanceFlow',
    inputSchema: PredictEBikeMaintenanceInputSchema,
    outputSchema: PredictEBikeMaintenanceOutputSchema,
  },
  async input => {
    const {output} = await predictEBikeMaintenancePrompt(input);
    return output!;
  }
);
