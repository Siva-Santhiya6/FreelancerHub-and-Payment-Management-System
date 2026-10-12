const aiService = require('../services/aiService');

// POST /api/ai/chat
const chat = async (req, res) => {
  try {
    const { message, language = 'en', context = {} } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required' });

    const response = await aiService.chat({
      message,
      language,
      userRole: req.user?.role || 'GUEST',
      context: { ...context, userId: req.user?._id }
    });

    res.json({ success: true, ...response });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { chat };
