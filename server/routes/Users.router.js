import express from 'express';
import { registerUser } from "../controllers/Users.controllers.js";


const router = express.Router();

router.post('/', registerUser);

export default router;