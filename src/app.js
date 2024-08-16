// app.js
const express = require('express');
const cors = require('cors');
const app = express();
const adminCheckMiddleware = require('./middleware/adminCheckMiddleware');
const userbanRoutes = require('./routes/userbanRoutes');
const analysisRoutes = require('./routes/analysisRoutes'); 
const connection = require('./config/db'); // DB 연결 설정 불러오기

app.use(adminCheckMiddleware);
app.use(cors({
    origin: 'http://127.0.0.1:3000' // 또는 '*'
  }));
  
app.use(express.json()); // JSON 요청 파싱
app.use('/', userbanRoutes);
app.use('/', analysisRoutes);
module.exports = app;