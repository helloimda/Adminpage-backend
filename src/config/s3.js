require('dotenv').config();
const { S3Client } = require('@aws-sdk/client-s3');

// AWS S3 설정 (SDK v3)
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESSKEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESSKEY,
    },
});

module.exports = s3Client;
