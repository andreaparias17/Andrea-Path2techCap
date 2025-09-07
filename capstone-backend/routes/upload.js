const router = require('express').Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protect, adminOnly } = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const ok = /^image\/(png|jpe?g|webp|gif|bmp)$/.test(file.mimetype);
    if (!ok) return cb(new Error('Only image files are allowed'));
    cb(null, true);
  },
});

router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const uploadFromBuffer = (buffer) => new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'rebellions' }, 
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(buffer);
    });

    const result = await uploadFromBuffer(req.file.buffer);

    return res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return res.status(500).json({ message: 'Upload failed' });
  }
});

module.exports = router;
