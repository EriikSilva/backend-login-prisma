import express from 'express';
import { registerUser, loginUser, getRegisterUsers, isAuthenticated} from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/getUsers', isAuthenticated ,getRegisterUsers)

export default router;
