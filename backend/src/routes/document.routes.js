import express from 'express'
import {ExplainConcept, getAllDocuments, upload_pdf_and_summary,getFlashcards, getQuizzes, generateNewQuiz, deleteDocument} from '../controllers/document.controller.js'
import {upload} from '../middleware/multer.middleware.js'
import { protectRoute } from '../middleware/auth.middleware.js'


const router=express.Router()
router.get('/all', protectRoute, getAllDocuments);
router.delete("/delete/:docID", protectRoute, deleteDocument);
router.post('/upload',protectRoute,upload.single('file'),upload_pdf_and_summary);
router.post('/explain/:docID',protectRoute,ExplainConcept)
router.get('/quizz/:docID',protectRoute,getQuizzes)
router.post('/quizz/:docID', protectRoute, generateNewQuiz);
router.post('/flashcards/:docID',protectRoute,getFlashcards)


export default router