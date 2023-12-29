import  express from "express";
import { deleteUser, login, logout, signup, updateUser } from "../controllers/userController.js";

const router = express.Router()

router.post('/auth', login)
router.post('/signup', signup)
router.get('/logout', logout)
router.put('/profile/:id', updateUser)
router.delete('/profile/:id', deleteUser)

export default router