import express from "express";

const router = express.Router();

router.post('/urls/shorten', shortenURL);

router.get('/urls/:id', redirectURL);

router.get('/urls/:id/stats', statsURL);

export default router;