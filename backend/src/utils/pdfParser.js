import { PDFParse } from "pdf-parse";
import fs from "fs/promises"
import { Document } from "../models/Document.model.js";

export const extractTextFromPDF = async(filePath)=>{
    try {
        console.log('reading file')
        const dataBuffer = await fs.readFile(filePath);
        const parser = new PDFParse(new Uint8Array(dataBuffer));
        const data = await parser.getText();
        return {
            text: data.text,
            numPages: data.numpages
        };
    } catch (error) {
        console.error("PDF Parsing Error:", error.message);
    }
}