const app = require('./app');
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} 에서 서버 실행중`);
});

// 전역 예외 처리 (uncaughtException)
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// 전역 Promise 거부 처리 (unhandledRejection)
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', promise, 'Reason:', reason);
});
