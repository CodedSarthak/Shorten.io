import express from "express";

import {shortenURL, redirectURL, statsURL} from '../controllers/url.controllers.js'

const router = express.Router();

router.route('/urls/shorten')
.post(shortenURL);

router.route('/urls/:ShortUrl')
.get(redirectURL);

router.route('/urls/:shortUrl/stats')
.get(statsURL);

export default router;