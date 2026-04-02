const express = require('express');
const cors = require('cors');
const multer = require('multer');
const xlsx = require('xlsx');

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

app.use(cors({
  origin: CORS_ORIGIN ? CORS_ORIGIN.split(',').map(origin => origin.trim()) : '*'
}));
app.use(express.json());

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to validate URL
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Convert sheet to JSON array
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    
    const urls = [];
    
    // Iterate through rows and columns to find URLs
    data.forEach(row => {
      row.forEach(cell => {
        if (typeof cell === 'string') {
          // Basic check if it looks like a URL
          const trimmed = cell.trim();
          if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
            if (isValidUrl(trimmed)) {
              urls.push(trimmed);
            }
          } else {
            // Check if it's a domain name that might be missing http
            const urlPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}/;
            if (urlPattern.test(trimmed)) {
               const withProtocol = 'https://' + trimmed;
               if (isValidUrl(withProtocol)) {
                 urls.push(withProtocol);
               }
            }
          }
        }
      });
    });

    // Remove duplicates
    const uniqueUrls = [...new Set(urls)];

    if (uniqueUrls.length === 0) {
      return res.status(404).json({ error: 'No URLs found in the file' });
    }

    res.json({ urls: uniqueUrls });
  } catch (error) {
    console.error('Error parsing file:', error);
    res.status(500).json({ error: 'Failed to parse file' });
  }
});

// Endpoint to check if a URL can be embedded in an iframe
app.post('/api/check-iframe', async (req, res) => {
  const { url } = req.body;

  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
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

    res.json({ canEmbed });
  } catch (error) {
    console.error(`Error checking URL ${url}:`, error);
    // If we can't even reach the site, it's safer to assume we can't embed it or it's down.
    res.json({ canEmbed: false, error: 'Failed to reach URL' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});