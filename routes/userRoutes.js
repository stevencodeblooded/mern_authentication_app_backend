import  express from "express";
import { deleteUser, login, logout, signupUsingGoogle, signup, updateUser } from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyUser.js";

const router = express.Router()

router.post('/auth', login)
router.post('/signup', signup)
router.get('/logout', logout)
router.put('/profile/:id', verifyToken, updateUser)
router.delete('/profile/:id', verifyToken, deleteUser)
router.post('/google', signupUsingGoogle)

export default router