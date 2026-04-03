const { extractUrlsFromFileBuffer } = require('../services/urlExtractionService');

const uploadFileAndExtractUrls = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const urls = extractUrlsFromFileBuffer(req.file.buffer);
    if (urls.length === 0) {
      return res.status(404).json({ error: 'No URLs found in the file' });
    }

    return res.json({ urls });
  } catch {
    return res.status(500).json({ error: 'Failed to parse file' });
  }
};

module.exports = {
  uploadFileAndExtractUrls,
};
