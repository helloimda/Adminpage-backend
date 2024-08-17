// controllers/analysisController.js
const analysisService = require('../services/analysisService');

const getVisitors = (req, res) => {
  const type = req.params.type;

  analysisService.getVisitors(type, (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    res.json(results);
  });
};

const getRegistrations = (req, res) => {
  const type = req.params.type;
  analysisService.getRegistrations(type, (error, count) => {
    if (error) {
      console.error("오늘 날짜에 가입자 수 집계 중 오류 발생:", error.message);
      return res
        .status(500)
        .send("오늘 날짜에 가입자 수 집계 중 오류가 발생했습니다.");
    }
    res.json(count);
  });
};

const getTotalMembers = (req, res) => {
  const type = req.params.type;

  analysisService.getTotalMembers(type, (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    res.json(results);
  });
};

const getGenderAndAgeStats = (req, res) => {
  analysisService.getGenderAndAgeStats((error, stats) => {
    if (error) {
      console.error('성별 및 연령대 집계 중 오류 발생:', error.message);
      return res.status(500).send('성별 및 연령대 집계 중 오류가 발생했습니다.');
    }
    res.json(stats);
  });
};

module.exports = {
  getVisitors, 
  getRegistrations,
  getTotalMembers,
  getGenderAndAgeStats,  
};
