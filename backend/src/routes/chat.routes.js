import express from 'express';
import { aiChat, getHistory } from '../controllers/chat.controller.js'; 
import { protectRoute } from '../middleware/auth.middleware.js'; 

const router = express.Router();


router.get("/history/:docID",protectRoute,getHistory);
router.post("/aiChat/:docID", protectRoute, aiChat);



export default router;