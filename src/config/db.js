require('dotenv').config();
const mysql = require('mysql2');
const { S3Client } = require('@aws-sdk/client-s3');

// MySQL 데이터베이스 연결 설정
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// 데이터베이스 연결 상태 확인
connection.connect((err) => {
    if (err) {
        console.error('데이터베이스 연결 실패:', err.stack);
        return;
    }
    console.log('데이터베이스에 연결 성공:', connection.threadId);
});

// AWS S3 설정 (SDK v3)
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESSKEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESSKEY,
    },
});

module.exports = {
    connection,
    s3Client
};
