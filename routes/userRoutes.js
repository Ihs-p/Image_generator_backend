import express from 'express'
const router = express.Router()
import { registerUser, loginUser, userCredits } from '../controllers/userController.js'
import userAuth from '../middlwares/auth.js'


router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/credits',userAuth, userCredits)


export default router