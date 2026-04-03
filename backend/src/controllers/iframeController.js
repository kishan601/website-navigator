const { checkIframeEmbeddability } = require('../services/iframeService');

const checkIframeCompatibility = async (req, res) => {
  const { url } = req.body;
  const result = await checkIframeEmbeddability(url);

  if (!result.valid) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  return res.json(result.error ? { canEmbed: result.canEmbed, error: result.error } : { canEmbed: result.canEmbed });
};

module.exports = {
  checkIframeCompatibility,
};
