require("dotenv").config();
const mysql = require('mysql2');

// 풀링을 사용하여 최대 연결 수를 설정
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,  // 최대 연결 수 설정 //ec2 배포할때 연결수 세팅하지않으면 하루단위로 팅김
    queueLimit: 0         // 대기열 제한 (0은 무제한)
});

// 연결 상태 확인
connection.getConnection((err, conn) => {
  if (err) {
    console.error('데이터베이스 연결 실패:', err.stack);
    return;
  }
  console.log('데이터베이스에 연결 성공:', conn.threadId);
  conn.release(); // 연결 반환
});

module.exports = connection;
