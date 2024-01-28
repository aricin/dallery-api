import AWS from 'aws-sdk';

// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID_AWS,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS,
    region: process.env.REGION_AWS,
});

const s3 = new AWS.S3();

const uploadHandler = async (req, res) => {
  if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
  }

  let base64String = '';

  // Accumulate the data chunks
  req.on('data', chunk => {
      base64String += chunk.toString();
  });

  // Called once all chunks are received
  req.on('end', async () => {
      try {
          // Remove data:image/*;base64, if it's there
          base64String = base64String.replace(/^data:image\/\w+;base64,/, "");
          const imageBuffer = Buffer.from(base64String, 'base64');
          
          // Define file name and content type
          const fileName = `${Date.now()}-image`;
          const contentType = 'image/jpeg';  // Set the appropriate content type, or extract it from the base64 string

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
  });

  req.on('error', (error) => {
      console.error('Error during data streaming:', error);
      res.status(500).json({ message: 'Error during data streaming' });
  });
};

export default uploadHandler;