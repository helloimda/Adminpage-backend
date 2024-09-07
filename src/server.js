const { ConnectContactLens } = require('aws-sdk');
const app = require('./app');
const PORT = process.env.PORT || 8080;
const exec = require('child_process').exec;

// // 포트가 이미 사용 중인지 확인
// exec(`lsof -i :${PORT}`, (err, stdout, stderr) => {
//   console.log("PORT 중복 사용 중 kill process")
//   if (stdout) {
//     // 포트가 사용 중이면 해당 프로세스 종료
//     const pid = stdout.split('\n')[1].split(/\s+/)[1];
//     exec(`kill -9 ${pid}`, (err) => {
//       if (err) {
//         console.log(`Failed to kill process: ${err}`);
//       } else {
//         console.log(`Killed process on port ${PORT}`);
//       }
//     });
//   }
// });


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



