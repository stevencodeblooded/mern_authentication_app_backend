import  express from "express";
import { deleteUser, getProfile, login, logout, signup, updateUser } from "../controllers/userController.js";

const router = express.Router()

router.post('/auth', login)
router.post('/signup', signup)
router.post('/logout', logout)
router.get('/profile/:id', getProfile)
router.put('/profile/:id', updateUser)
router.delete('/profile/:id', deleteUser)

export default router