// pages/api/getImages.js
import AWS from 'aws-sdk';

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID_AWS,
  secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS,
  region: process.env.REGION_AWS,
});

const s3 = new AWS.S3();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const params = {
    Bucket: process.env.S3_BUCKET_NAME_AWS,
  };

  try {
    const { Contents } = await s3.listObjectsV2(params).promise();
    const images = Contents.map(content => ({
      key: content.Key,
      url: `https://${params.Bucket}.s3.${process.env.REGION_AWS}.amazonaws.com/${content.Key}`,
    }));
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'There was an error fetching your files' });
  }
}
