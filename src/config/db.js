require("dotenv").config();
const mysql = require('mysql2');

// 연결 풀 생성
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,  // 풀에서 최대 10개의 연결 유지
    queueLimit: 0         // 대기열 제한 없음
});

// connection 객체를 export하기 위한 래퍼 함수
const connection = {
    query: (sql, params, callback) => {
        pool.getConnection((err, conn) => {
            if (err) {
                callback(err, null);
            } else {
                conn.query(sql, params, (error, results) => {
                    // 쿼리가 끝난 후 연결 반환
                    conn.release();
                    callback(error, results);
                });
            }
        });
    },
    // 필요시 connection 객체의 다른 메소드들도 추가 가능
    escape: (value) => pool.escape(value)
};

// 연결 상태 확인
pool.getConnection((err, conn) => {
  if (err) {
    console.error('데이터베이스 연결 실패:', err.stack);
    return;
  }
  console.log('데이터베이스에 연결 성공:', conn.threadId);
  conn.release();
});

module.exports = connection;
