import express from "express";

import {shortenURL, redirectURL, statsURL} from '../controllers/url.controllers.js'

const router = express.Router();

router.route('/urls/shorten')
.post(shortenURL);

router.route('/urls/:id')
.get(redirectURL);

router.route('/urls/:id/stats')
.get(statsURL);

export default router;