const app = require('./app');
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} 에서 서버 실행중`);
});
