const express = require("express");
const multer = require("multer");
const { get_image_by_id, upload_image } = require("./image_module");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 10MB file size limit
    }
});



router.get('/:id', get_image_by_id);
router.post('/upload-image', upload.single('image'), upload_image);

module.exports = router;