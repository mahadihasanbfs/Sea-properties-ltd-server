const { ObjectId } = require("mongodb");
const { image_collection } = require("../../Collections/ImageCollection");


const upload_image = async (req, res, next) => {
    try {
        const fileBuffer = req.file.buffer;
        const fileType = req.file.mimetype.startsWith('image') ? 'jpg' : 'pdf';
        const result = await image_collection.insertOne({ file: fileBuffer, fileType });

        const fileUrl = `https://sea-properties-server.vercel.app/api/v1/image/${result.insertedId}.${fileType}`;

        res.send({ imageUrl: fileUrl });
    } catch (err) {
        next(err);
    }
};

const get_image_by_id = async (req, res, next) => {
    try {
        let fileId = req.params.id;
        fileId = fileId.replace(/\.[^/.]+$/, "");

        const fileDoc = await image_collection.findOne({ _id: new ObjectId(fileId) });

        if (!fileDoc) {
            res.status(404).json({ error: 'File not found' });
        } else {
            const fileType = fileDoc.fileType;
            const contentType = fileType === 'jpg' ? 'image/jpeg' : 'application/pdf';
            res.contentType(contentType);
            const fileBuffer = Buffer.from(fileDoc.file.buffer, 'base64');
            res.status(200).send(fileBuffer);
        }
    } catch (err) {
        console.error('Error in GetFileByID:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { upload_image, get_image_by_id };
