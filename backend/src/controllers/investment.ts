import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { get } from 'lodash';
import { createInvestmentProfile } from '../db/investment';

// Function to read CSV files and return their content as a string
const readCsv = async (filePath: string): Promise<string> => {
    try {
        const fullPath = path.join(__dirname, '..', '..', filePath);
        return await fs.readFile(fullPath, 'utf8');
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        throw new Error(`Could not read data file: ${filePath}`);
    }
};

// --- New Data Processing Logic ---

/**
 * Parses a CSV string into an array of objects.
 * @param csvString The raw CSV content.
 * @returns A promise that resolves to an array of objects.
 */
const parseCsv = (csvString: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const results: any[] = [];
        const stream = Readable.from(csvString);
        stream
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};

// Main controller function for investment advice
export const getInvestmentAdvice = async (req: express.Request, res: express.Response) : Promise<any> => {
    try {
        const investment_profile_data = req.body;
        const currentUserId = get(req, 'identity._id') as string;

        if (!currentUserId) {
            return res.status(403).json({ message: "User not authenticated" });
        }
        
        const profileToSave = {
            ...investment_profile_data,
            userId: currentUserId,
        };

        try {
            console.log("Attempting to save investment profile...");
            const savedProfile = await createInvestmentProfile(profileToSave);
            console.log("Successfully saved investment profile:", savedProfile);
        } catch (dbError) {
            console.error("DATABASE SAVE ERROR:", dbError);
            return res.status(500).json({ message: 'Failed to save investment profile.', error: dbError.message });
        }

        // --- 1. Load and Parse Data from CSV files ---
        const [
            historical_data_raw,
            forecasted_data_raw,
            areas_info_raw,
            areas_neighbourhoods_raw
        ] = await Promise.all([
            fs.readFile(path.join(__dirname, '..', '..', 'data/current_prices.json'), 'utf8'),
            fs.readFile(path.join(__dirname, '..', '..', 'data/forecasted_prices.json'), 'utf8'),
            fs.readFile(path.join(__dirname, '..', '..', 'data/Areas_info.csv'), 'utf8'),
            fs.readFile(path.join(__dirname, '..', '..', 'data/areas-aqarmap.csv'), 'utf8')
        ]);
        
        const areas_info = await parseCsv(areas_info_raw);
        const areas_neighbourhoods = await parseCsv(areas_neighbourhoods_raw);
        
        const forecasted_data_json = JSON.parse(forecasted_data_raw);
        const forecasted_data_summary = JSON.stringify(forecasted_data_json, null, 2);

        
        const historical_data_json = JSON.parse(historical_data_raw);
        const historical_data_summary = JSON.stringify(historical_data_raw, null, 2);
        
        // --- 2. Summarize Data for the Prompt ---
        // For now, we are creating a structured summary of the area/neighborhood info.
        // This is much cleaner for the AI to understand.
        const areas_info_summary = JSON.stringify(areas_info, null, 2);
        const areas_neighbourhoods_summary = JSON.stringify(areas_neighbourhoods, null, 2);


        // --- 3. Construct the Prompt for Gemini ---
        const promptText = await fs.readFile(path.join(__dirname, '..', '..', 'data/prompt.txt'), 'utf8');
        
        const prompt = promptText
            .replaceAll('{current_prices}', historical_data_summary) // Still sending raw for now
            .replaceAll('{forecasted_prices}', forecasted_data_summary)
            .replaceAll('{areas_info}', areas_info_summary) // Sending structured JSON
            .replaceAll('{areas_neighbourhoods_info}', areas_neighbourhoods_summary) // Sending structured JSON
            .replaceAll('{investment_goal}', investment_profile_data.investment_goal)
            .replaceAll('{time_horizon}', investment_profile_data.time_horizon)
            .replaceAll('{risk_tolerance}', investment_profile_data.risk_tolerance)
            .replaceAll('{investment_capital}', investment_profile_data.investment_capital)
            .replaceAll('{priority}', investment_profile_data.priority)
            .replaceAll('{experience}', investment_profile_data.experience)
            .replaceAll('{liquidity}', investment_profile_data.liquidity)
            .replaceAll('{additional_requests}', investment_profile_data.additional_requests);
            
        // --- 4. Call Gemini API ---
        try {
            console.log("Checking for Gemini API key...");
            if (!process.env.GEMINI_API_KEY) {
                throw new Error("GEMINI_API_KEY is not configured in the .env file.");
            }
            console.log("API key found. Calling Gemini API...");

            console.log("--- PROMPT SENT TO GEMINI ---");
           
            console.log("-----------------------------");

            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = await response.text();

            // --- 5. Format and Send Response ---
            let cleanedText = text.trim();
            if (cleanedText.startsWith('```json')) {
                cleanedText = cleanedText.substring(7); // Remove ```json
                if (cleanedText.endsWith('```')) {
                    cleanedText = cleanedText.slice(0, -3); // Remove ```
                }
            }
            
            const jsonResponse = JSON.parse(cleanedText);
            console.log(jsonResponse);

            console.log("Successfully received response from Gemini. Sending to client.");
            return res.status(200).json(jsonResponse);

        } catch (apiError) {
            console.error("GEMINI API ERROR:", apiError);
            return res.status(500).json({ message: 'Failed to get investment advice from AI service.', error: apiError.message });
        }

    } catch (error) {
        console.error('Error getting investment advice:', error);
        return res.status(500).json({ message: 'Failed to get investment advice', error: error.message });
    }
}; 