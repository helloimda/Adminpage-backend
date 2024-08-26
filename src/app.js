// app.js
const express = require("express");
const cors = require("cors");
const app = express();
const path = require('path');
const adminCheckMiddleware = require("./middleware/adminCheckMiddleware");
const userbanRoutes = require("./routes/userbanRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const connection = require("./config/db"); // DB 연결 설정 불러오기
const userRoutes = require('./routes/userRoutes');
const postmanageRoutes = require('./routes/postmanageRoutes');
const memberQnaRoutes = require('./routes/memberqna');
app.use(
  cors({
    origin: "*", // 또는 '*'
  })
);


app.use(adminCheckMiddleware);

app.use(express.json()); // JSON 요청 파싱
app.use('/', postmanageRoutes);
app.use('/', userRoutes);
app.use("/", userbanRoutes);
app.use("/", analysisRoutes);
app.use("/", memberQnaRoutes);
module.exports = app;
