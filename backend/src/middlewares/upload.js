// middlewares/upload.js
const multer = require('multer');

// Set up memory storage (for storing files in memory temporarily)
const storage = multer.memoryStorage();

// Create multer instance with file size limit and file storage configuration
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size of 5MB
});

module.exports = upload;
