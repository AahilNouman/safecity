const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { classifyIncident } = require('../services/aiService');

router.use(verifyToken);

router.post('/classify', async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, error: 'Text is required' });
    }
    
    const result = await classifyIncident(text);
    
    if (!result) {
      return res.status(503).json({ success: false, error: 'AI Service unavailable' });
    }
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
