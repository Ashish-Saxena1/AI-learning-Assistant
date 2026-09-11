import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";
const gemini=process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({gemini});

async function main() {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "what are the use of ram in motherboard give me a precise and crisp answer",
        // config: {
        //     temperature: 0.1,
        // },
    });
    console.log(response.text);
}

await main();