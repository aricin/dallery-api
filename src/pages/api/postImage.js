// pages/api/images.js
import AWS from 'aws-sdk';

// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID_AWS,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS,
    region: process.env.REGION_AWS,
});

const s3 = new AWS.S3();

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',  // Adjust as needed
        },
    },
};

const uploadHandler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'No image provided' });
        }

        // Extracting base64 data from the request body
        const base64String = message.replace(/^data:image\/\w+;base64,/, "");
        const imageBuffer = Buffer.from(base64String, 'base64');

        console.log(base64String);

        // Define file name and content type
        const fileName = `${Date.now()}-image`;
        const contentType = 'image/jpeg';  // Set the appropriate content type. You might want to extract it from the base64 string.

        // Upload to S3
        const params = {
            Bucket: process.env.S3_BUCKET_NAME_AWS,
            Key: fileName,
            Body: imageBuffer,
            ContentType: contentType,
            ContentEncoding: 'base64',  // required
        };

        await s3.upload(params).promise();
        res.status(200).json({ message: 'File uploaded successfully', fileName });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'There was an error uploading your file' });
    }
};

export default uploadHandler;
