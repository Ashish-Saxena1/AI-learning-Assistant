import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function listModels() {
    try {
        
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("API Key nahi mili! .env file check karo.");
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        
        console.log("Fetching available models for your API key...");

        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();

        if (data.error) {
            console.error(" Error from Google:", data.error.message);
            return;
        }

        console.log("\n Available Models:");
        data.models.forEach(model => {
            console.log(`- Name: ${model.name}`);
            console.log(`  Methods: ${model.supportedGenerationMethods.join(", ")}`);
            
        });

    } catch (error) {
        console.error(" Failed to fetch models:", error.message);
    }
}

listModels();