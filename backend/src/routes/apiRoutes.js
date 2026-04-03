const express = require('express');
const multer = require('multer');
const { uploadFileAndExtractUrls } = require('../controllers/uploadController');
const { checkIframeCompatibility } = require('../controllers/iframeController');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('file'), uploadFileAndExtractUrls);
router.post('/check-iframe', checkIframeCompatibility);

module.exports = router;
