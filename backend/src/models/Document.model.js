import mongoose, { Schema } from "mongoose";
const DocSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true

    },
    title: {
        type: String,
        required: true
    },
    fileURL: {
        type: String,
        required: true,
    },
    size:{
        type:Number,
        required:true
    },
    pdfdata:{
        type:String,
        default:""
    },

    

    notes: {
        type: String,
        default: "" ,
    },
    flashcards: [
        {
            setName: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
            cards: [
                {
                    question: { type: String, required: true },
                    answer: { type: String, required: true }
                }
            ]
        }
    ],
    quizzes:[ 
        {
        setId: { 
            type: String, 
            required: true,
            default: () => `set_${Date.now()}` 
        },
        createdAt: { 
            type: Date, 
            default: Date.now 
        },
        questions: [
            {
                question: { type: String, required: true },
                options: [{ type: String, required: true }],
                correctAnswer: { type: String, required: true }
            }
        ]
    }]

}, { timestamps: true })
export const Document =mongoose.model('Document',DocSchema)