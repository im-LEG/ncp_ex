const { S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.NCP_REGION || 'kr-standard',
  endpoint: process.env.NCP_ENDPOINT || 'https://kr.object.ncloudstorage.com',
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.NCP_ACCESS_KEY,
    secretAccessKey: process.env.NCP_SECRET_KEY
  }
});

module.exports = s3;
