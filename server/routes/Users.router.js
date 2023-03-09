import express from 'express';
import { changeUserProfile, deleteUserProfile, loginUser, registerUser, updateUserProfile } from "../controllers/Users.controllers.js";
import { protect } from '../middlewares/Auth.js';


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/update', protect, updateUserProfile);
router.delete('/delete', protect, deleteUserProfile);
router.put('/password', protect, changeUserProfile);

export default router;