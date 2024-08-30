const app = require('./app');
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} 에서 서버 실행중`);
});

// 전역 예외 처리 (uncaughtException)
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // 서버가 불안정해질 수 있으므로, 로깅 후 필요에 따라 서버를 종료합니다.
  // process.exit(1); // 주석을 제거하여 필요한 경우 서버를 종료합니다.
});

// 전역 Promise 거부 처리 (unhandledRejection)
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', promise, 'Reason:', reason);
  // 서버가 불안정해질 수 있으므로, 로깅 후 필요에 따라 서버를 종료합니다.
  // process.exit(1); // 주석을 제거하여 필요한 경우 서버를 종료합니다.
});
