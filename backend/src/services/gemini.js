import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";
import { extractTextFromPDF } from "../utils/pdfParser.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const analyzePDFsummary = async (TextForResponse) => {
    try {
        if (!TextForResponse) {
            throw new Error("Text not found in PDF");
        }
        const prompt = `Act as a structured data extractor and expert educator. Read the provided text and generate a comprehensive educational summary.
        Return ONLY a JSON object. Do not include markdown code blocks, explanations, or any text outside the JSON object.

Strictly follow this structure: 
- "notes": A single String containing a high-quality, professional summary. 
    Guidelines for "notes":
    1. Use Markdown for structure (use # for titles, ## for headers).
    2. Use bold text (**important terms**) for key concepts.
    3. Use bullet points for detailed explanations.
    4. Include a "Examples" section for practical understanding of the concepts.
    5. The content should be deeply structured, not just a plain paragraph. ${TextForResponse}`

        const result = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite-preview",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });
        console.log(result)

        const cleanJson = result.text.replace(/```json | ```/g, "").trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("Gemini Error:", error.message);
        throw error;
    }
};

export const explainPDFconcept = async (DataForContext, topic) => {
    try {
        if (!DataForContext || !topic) {
            throw new Error("error in getting data or topic") 

        }
        console.log(topic)
        const prompt = `
    Act as a structured data extractor and expert educator.
    Return ONLY a JSON object. Do not include markdown code blocks.
    
    Structure:
    {
    "title": "Title of the topic",
    "explanation": "The entire detailed explanation in Markdown string format"
    }

    INSTRUCTIONS:
    1. Topic: "${topic}"
    2. Document Context: ${DataForContext.substring(0, 15000)}
    3. The "explanation" field must contain headers (##), bold text (**), and bullet points.
    4. Include an "Examples" section inside the explanation.
    5. If not in doc, then explain only briefly and start "explanation" with: "> Not found in doc, but here is the general explanation:"
`;
        console.log('prompt use hua') 

        const result = await ai.models.generateContent({
            // model: "gemini-3-flash-preview",
            model: "gemini-3-flash-preview",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });
        console.log(result)

        const cleanJson = result.text.replace(/```json | ```/g, "").trim();
        return JSON.parse(cleanJson);
    }
    catch (error) {
        console.error("Gemini Error:", error.message);
        throw error;
    }
}


export const askAI = async (pdfdata, ques_message, historyContext) => {
    console.log('gemini chala')
    try {
        console.log(`gemini hit${ques_message}`)
        if (!ques_message) {
            throw new Error("error in getting ques_message") 
        }
        console.log('gemini hit')
        const prompt = `
            You are an elite Academic Study Assistant. 
            Answer the USER QUESTION based on the PDF CONTEXT.
            Keep it under 100 words. Use plain text.
            ---
            PDF CONTEXT: ${pdfdata.substring(0, 16000)}
            ---
            HISTORY: ${historyContext}
            ---
            USER QUESTION: "${ques_message}"
        `
        console.log('result gemini')
        const result = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });
        const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) {
            throw new Error("No response from AI");
        }
        return rawText.trim();

    } catch (error) {
        console.error("Gemini Error:", error.message);
        throw error;
    }
}
export const AiQuizzes = async (pdfdata) => {
    try {
        const prompt = `Act as an academic examiner. Based on the following context: ${pdfdata}, generate 5 multiple-choice questions.

STRICT INSTRUCTIONS:

1.Return ONLY a valid JSON array of objects.

2.Do NOT include markdown formatting, backticks 
3. Each object must follow this EXACT schema:
>    {
>      "question": "string",
>      "options": ["string", "string", "string", "string"],
>      "correctAnswer": "string"
>    }
> 4. Ensure 'correctAnswer' exactly matches one of the strings in the 'options' array.
> 5. Keep the language simple and academic.`


console.log('got prompt')

        const result = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });
        const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log(`gemini se aya ${rawText}`)
        if (!rawText) throw new Error("Gemini returned empty text");
        const cleanJSON = rawText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const finalQuizArray = JSON.parse(cleanJSON);
        return finalQuizArray;

    } catch (error) {
        console.error("Error in AiQuizzes service:", error.message);
        throw error;
    }
}

export const AiFlashcards = async (pdfdata) => {
    try {
        const prompt = `You are an expert educational assistant. Your task is to analyze the provided PDF document text and generate a comprehensive set of 10 high-quality flashcards for active recall study.

    Strictly follow these rules:
    1. Each flashcard must have a concise 'question' (front) and a clear, accurate 'answer' (back) based ONLY on the provided text.
    2. Do NOT add any introductory text, markdown formatting (like \`\`\`json), or explanations.
    3. Return ONLY a valid JSON array matching the structure specified below.

    Desired Output Format:
    [
    {
        "question": "What is the primary concept explained in section 1?",
        "answer": "The primary concept is active recall state management."
    },
    {
        "question": "Who developed the open-source library mentioned in the text?",
        "answer": "It was developed and is maintained by Meta."
    }
    ]
    Here is the PDF Text:
    ${pdfdata}`
    console.log('got prompt')

        const result = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });
        const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log(`gemini se aya ${rawText}`)
        if (!rawText) throw new Error("Gemini returned empty text");
        const cleanJSON = rawText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const finalCardsArray = JSON.parse(cleanJSON);
        return finalCardsArray;

        
    }
    catch (error) {
        console.error("Error in AiFlashcards service:", error.message);
        throw error;
    }
}