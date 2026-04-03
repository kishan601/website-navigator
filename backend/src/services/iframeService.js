const { isValidUrl } = require('../utils/urlUtils');

const checkIframeEmbeddability = async (url) => {
  if (!url || !isValidUrl(url)) {
    return { valid: false, canEmbed: false };
  }

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const xFrameOptions = response.headers.get('x-frame-options');
    const csp = response.headers.get('content-security-policy');
    let canEmbed = true;

    if (xFrameOptions) {
      const xfo = xFrameOptions.toLowerCase();
      if (xfo === 'deny' || xfo === 'sameorigin') {
        canEmbed = false;
      }
    }

    if (csp) {
      const cspLower = csp.toLowerCase();
      if (cspLower.includes("frame-ancestors 'none'") || cspLower.includes("frame-ancestors 'self'")) {
        canEmbed = false;
      }
    }

    return { valid: true, canEmbed };
  } catch {
    return { valid: true, canEmbed: false, error: 'Failed to reach URL' };
  }
};

module.exports = {
  checkIframeEmbeddability,
};
