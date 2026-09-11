import { Document } from "../models/Document.model.js";
import { AiFlashcards, AiQuizzes, analyzePDFsummary, explainPDFconcept } from "../services/gemini.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import { extractTextFromPDF } from "../utils/pdfParser.js";

export const upload_pdf_and_summary = async (req, res) => {
    const localPath = req.file.path;
    console.log("Local Path:", localPath);
    
    try {
        const parsedData = await extractTextFromPDF(localPath);
        console.log("Starting Analysis & Upload...");
        const cloudinaryResult = await cloudinary.uploader.upload(localPath, {
            folder: "AI_Learning_PDFs",
            resource_type: "image",
            format: "pdf",
            access_mode: "public"
        })
        let initialSummary=''
        try{
            const aiSummary=await analyzePDFsummary(parsedData.text)
            initialSummary=aiSummary.notes
        }catch(error){
            console.error("failed in ai summary")
        }


        
        const newDoc = await Document.create({
            userId: req.user._id,
            title: req.body.title || req.file.originalname,
            size: req.file.size,
            fileURL: cloudinaryResult.secure_url, 
            pdfdata: parsedData.text,
            notes: initialSummary,
        
        });
        
        if (fs.existsSync(localPath)) fs.unlinkSync(localPath);

        res.status(200).json(newDoc);

    } catch (error) {
        if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const ExplainConcept=async(req,res)=>{
    try {
        const { docID } = req.params;
        const { topic } = req.body;
        const doc = await Document.findById(docID);
        if (!doc) return res.status(404).json({ message: "Doc not found" });
        const explanationText= await explainPDFconcept(doc.pdfdata,topic)
        res.status(200).json(explanationText)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllDocuments = async (req, res) => {
    try {
        const userId = req.user._id;
        const documents = await Document.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ message: "Error fetching documents", error: error.message });
    }
};




export const getFlashcards=async(req,res)=>{
    try {
        const {docID}=req.params;
        
        const doc=await Document.findById(docID);
        
        if(!doc) return res.status(404).json({message:"Doc not found"})
        
        const flashcards= await AiFlashcards(doc.pdfdata)
        
        const CurrentSetCount=doc.flashcards? doc.flashcards.length:0
        const NextSetCount=CurrentSetCount+1;
        const newSetObject={
            setName:`Set #${NextSetCount}`,
            cards:flashcards
        };
        if (!doc.flashcards) doc.flashcards = [];
        doc.flashcards.push(newSetObject);
        await doc.save();
        
        
        return res.status(200).json(doc.flashcards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}






export const getQuizzes = async (req, res) => {
    try {
        const { docID } = req.params;
        const doc = await Document.findById(docID);
        
        if (!doc) return res.status(404).json({ message: "Document not found" });

        
        const sets = doc.quizSets || [];
        return res.status(200).json({ quizSets: sets });
    } catch (error) {
        console.error("Error in getQuizzes:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const generateNewQuiz = async (req, res) => {
    try {
        const { docID } = req.params;
        const doc = await Document.findById(docID);
        
        if (!doc) return res.status(404).json({ message: "Document not found" });

        const pdfContentText = doc.pdfdata
        if (!pdfContentText) {
            return res.status(400).json({ message: "Document content is empty" });
        }

        
        const parsedQuestions = await AiQuizzes(pdfContentText);

        const newSet = {
            // setId: `set_${Date.now()}`,
            setId: `set_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
            questions: parsedQuestions
        };

        if (!doc.quizzes) doc.quizzes = [];
        
        doc.quizzes.push(newSet);
        await doc.save();

        return res.status(200).json({ 
            quizSets: doc.quizzes, activeSetId: newSet.setId });
    } catch (error) {
        console.error("Error in generateNewQuiz:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteDocument = async (req, res) => {
    try {
        const { docID } = req.params;

    
        const deletedDoc = await Document.findByIdAndDelete(docID);

        
        if (!deletedDoc) {
            return res.status(404).json({ message: "Document not found" });
        }

        return res.status(200).json({ message: "Document deleted successfully from database" });

    } catch (error) {
        console.error("Error in deleteDocument:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};