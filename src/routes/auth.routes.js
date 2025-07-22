import express from "express";

import {register, login, logout} from '../controllers/auth.controllers.js'
import verifyAccess from "../middlewares/authMiddleware.js";

import myrateLimit from "../middlewares/rateLimiter.js";

const router = express.Router();

router.route('/register')
.post(register);

router.route('/login', myrateLimit)
.post(login);

router.route('/logout', verifyAccess)
.post(logout);

export default router;