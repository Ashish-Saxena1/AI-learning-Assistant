import { askAI } from "../services/gemini.js";
import { ChatData } from "../models/Chat.model.js";
import { Document } from "../models/Document.model.js";

export const aiChat = async (req, res) => {
    console.log('controller chal gya ')


    try {

        const { docID } = req.params;
        console.log(`controller hit${docID}`)



        const { ques_message } = req.body;
        console.log(`controller hit${ques_message}`)

        let chat = await ChatData.findOne({ documentId: docID });
        // const historyContext = chat
        //     ? chat.messages.slice(-5).map(m => `${m.role}: ${m.content}`).join("\n")
        //     : "";
        const historyContext=''



        const doc = await Document.findById(docID);
        if (!doc) return res.status(404).json({ message: "Doc not found" });

        console.log('ai res manga controller ne ')
        const AIres = await askAI(doc.pdfdata, ques_message, historyContext)
        console.log(`ai reply ${AIres}`)

        console.log('chat saving chal gya')
        if (!chat) {
            chat = new ChatData({ documentId: docID, messages: [] });
        }

        if (!AIres) {
            return res.status(500).json({ message: "AI response was empty" });
        }

        chat.messages.push({ role: 'user', content: ques_message })
        chat.messages.push({ role: 'ai', content: AIres })
        chat.save();
        res.status(200).json({
            reply: AIres,
            fullHistory: chat.messages
        })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getHistory = async (req, res) => {
    try {
        const { docID } = req.params;
        // const userId = req.user._id;
        const history = await ChatData.findOne({ documentId: docID });
        if (!history){
            return res.status(200).json([]);
        }
    res.status(200).json(history.messages);
} catch (error) {
    console.error("error in chathistory:",error);
    res.status(500).json({message:"internal server error", error:error.message})
    }
}