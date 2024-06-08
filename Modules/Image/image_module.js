const { ObjectId } = require("mongodb");
const { image_collection } = require("../../Collections/ImageCollection");
const sharp = require("sharp");


// const upload_image = async (req, res, next) => {
//     try {
//         const fileBuffer = req.file.buffer;
//         const fileType = req.file.mimetype.startsWith('image') ? 'jpg' : 'pdf';
//         const result = await image_collection.insertOne({ file: fileBuffer, fileType });

//         const fileUrl = `https://backend.seapropertiesltd.com.bd/api/v1/image/${result.insertedId}.${fileType}`;

//         res.send({ imageUrl: fileUrl });
//     } catch (err) {
//         next(err);
//     }
// };


const upload_image = async (req, res, next) => {
    try {
        const imageBuffer = req.file.buffer;
        const fileType = req.file.mimetype.startsWith('image') ? 'jpg' : 'pdf';
        // Compress the image using sharp
        const compressedImageBuffer = await sharp(imageBuffer)
            .resize({ width: 600 }) // Resize the image to a width of 600 pixels, maintaining aspect ratio
            .jpeg({
                quality: 70, // Compress the image to 70% quality
                chromaSubsampling: '4:4:4' // Use 4:4:4 chroma subsampling for better color retention
            })
            .toBuffer();

        // Create data object
        let data = { image: compressedImageBuffer };

        const result = await image_collection.insertOne(data);

        // Construct image URL
        const fileUrl = `https://backend.seapropertiesltd.com.bd/api/v1/image/${result.insertedId}.${fileType}`;

        res.send({ imageUrl: fileUrl });
    } catch (err) {
        // Pass error to the error handling middleware
        next(err);
    }
}


// const get_image_by_id = async (req, res, next) => {
//     try {
//         let fileId = req.params.id;
//         fileId = fileId.replace(/\.[^/.]+$/, "");

//         const fileDoc = await image_collection.findOne({ _id: new ObjectId(fileId) });

//         if (!fileDoc) {
//             res.status(404).json({ error: 'File not found' });
//         } else {
//             const fileType = fileDoc.fileType;
//             const contentType = fileType === 'jpg' ? 'image/jpeg' : 'application/pdf';
//             res.contentType(contentType);
//             const fileBuffer = Buffer.from(fileDoc.file.buffer, 'base64');
//             res.status(200).send(fileBuffer);
//         }
//     } catch (err) {
//         console.error('Error in GetFileByID:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

const get_image_by_id = async (req, res, next) => {
    try {
        let imageId = req.params.id;
        imageId = imageId.replace(/\.[^/.]+$/, "");

        const imageDoc = await image_collection.findOne({ _id: new ObjectId(imageId) });

        if (!imageDoc) {
            res.status(404).json({ error: 'Image not found' });
        } else {
            res.contentType('image/jpeg');
            const imageBuffer = Buffer.from(imageDoc.image.buffer, 'base64');
            res.status(200).send(imageBuffer);
        }
    } catch (err) {
        console.error('Error in GetImageByID:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}




module.exports = { upload_image, get_image_by_id };
