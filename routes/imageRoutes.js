import express from "express";
import { generateImage } from "../controllers/imageController.js";
import userAuth from "../middlwares/auth.js";
const router = express.Router();

router.post("/generate-image",userAuth, generateImage);



export default router;
