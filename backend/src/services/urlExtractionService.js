const xlsx = require('xlsx');
const { isValidUrl } = require('../utils/urlUtils');

const extractUrlsFromFileBuffer = (fileBuffer) => {
  const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  const urls = [];

  data.forEach((row) => {
    row.forEach((cell) => {
      if (typeof cell !== 'string') {
        return;
      }

      const trimmed = cell.trim();
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        if (isValidUrl(trimmed)) {
          urls.push(trimmed);
        }
        return;
      }

      const urlPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}/;
      if (urlPattern.test(trimmed)) {
        const withProtocol = `https://${trimmed}`;
        if (isValidUrl(withProtocol)) {
          urls.push(withProtocol);
        }
      }
    });
  });

  return [...new Set(urls)];
};

module.exports = {
  extractUrlsFromFileBuffer,
};
