const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const File = require('../models/File');
const auth = require('../middleware/auth');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create user-specific folder
    const userDir = path.join(uploadsDir, req.user.id);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
});

// All routes require authentication
router.use(auth);

// POST /api/files/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Check 500MB user quota
    const userFiles = await File.find({ user: req.user.id });
    const totalStorageUsed = userFiles.reduce((sum, f) => sum + f.size, 0);
    const MAX_STORAGE = 500 * 1024 * 1024; // 500 MB

    if (totalStorageUsed + req.file.size > MAX_STORAGE) {
      // Delete the temporarily uploaded file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'Storage limit of 500MB exceeded.' });
    }

    const file = await File.create({
      name: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path,
      user: req.user.id,
    });

    res.status(201).json(file);
  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

// GET /api/files
router.get('/', async (req, res) => {
  try {
    const files = await File.find({ user: req.user.id }).sort({ uploadedAt: -1 });
    res.json(files);
  } catch (err) {
    console.error('List files error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/files/download/:id
router.get('/download/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Ensure user owns the file
    if (file.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check file exists on disk
    if (!fs.existsSync(file.path)) {
      return res.status(404).json({ message: 'File not found on disk' });
    }

    res.download(file.path, file.originalName);
  } catch (err) {
    console.error('Download error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/files/:id
router.delete('/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Ensure user owns the file
    if (file.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete from disk
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete from database
    await File.findByIdAndDelete(req.params.id);

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
