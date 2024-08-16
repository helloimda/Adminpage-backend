// app.js
const express = require('express');
const app = express();
const adminCheckMiddleware = require('./middleware/adminCheckMiddleware');
const userbanRoutes = require('./routes/userbanRoutes');
const analysisRoutes = require('./routes/analysisRoutes'); 
const connection = require('./config/db'); // DB 연결 설정 불러오기

app.use(adminCheckMiddleware);
app.use(express.json()); // JSON 요청 파싱
app.use('/', userbanRoutes);
app.use('/', analysisRoutes);
module.exports = app;