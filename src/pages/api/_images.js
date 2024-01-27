const AWS = require('aws-sdk');
const { IncomingForm } = require('formidable');
const fs = require('fs').promises;

// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID_AWS,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS,
    region: process.env.REGION_AWS,
});

const s3 = new AWS.S3();

export const config = {
    api: {
        bodyParser: false, // We need this for formidable to work
    },
};

const uploadHandler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const data = await new Promise((resolve, reject) => {
        const form = new IncomingForm();

        form.parse(req, (err, fields, files) => {
            if (err) return reject(err);
            resolve({ fields, files });
        });
    });

    const files = data.files;
    const file = files?.file[0];
    const fileContent = await fs.readFile(file.filepath);
    const fileName = `${Date.now()}-${file.originalFilename}`;

    // Upload to S3
    const params = {
        Bucket: process.env.S3_BUCKET_NAME_AWS,
        Key: fileName,
        Body: fileContent,
        ContentType: file.mimetype,
    };

    try {
        await s3.upload(params).promise();
        res.status(200).json({ message: 'File uploaded successfully', fileName });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'There was an error uploading your file' });
    }
};

export default uploadHandler;
