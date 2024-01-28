// pages/api/upload.js
import { NextApiRequest, NextApiResponse } from 'next';
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID_AWS,
  secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS,
  region: process.env.REGION_AWS,
});

let imageString = '';

export default function uploadHandler(req, res) {
  if (req.method === 'POST') {
    const { chunk, isLastChunk } = req.body;
    imageString += chunk;

    if (isLastChunk) {
      const buffer = Buffer.from(imageString, 'base64');
      const fileName = `${Date.now()}-image`;

      const params = {
        Bucket: process.env.S3_BUCKET_NAME_AWS,
        Key: fileName,
        Body: buffer,
        ContentType: 'image/jpeg', // Adjust content type accordingly
      };

      s3.upload(params, (err, data) => {
        if (err) {
          console.error('Error', err);
          res.status(500).json({ error: 'Error uploading file' });
          return;
        }
        console.log('Upload Success', data.Location);
        res.status(200).json({ message: 'File uploaded successfully', data });
      });

      // Reset imageString for the next image
      imageString = '';
    } else {
      res.status(200).json({ message: 'Chunk received' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
