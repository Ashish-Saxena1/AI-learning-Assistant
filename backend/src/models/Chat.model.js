import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
    messages: [
        {
            role: { type: String, enum: ['user', 'ai'], required: true },
            content: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ]
});

export const ChatData = mongoose.model('ChatData', chatSchema);