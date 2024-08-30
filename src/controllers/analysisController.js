// controllers/analysisController.js
const analysisService = require('../services/analysisService');

const getVisitors = (req, res) => {
  try{
    const type = req.params.type;

    analysisService.getVisitors(type, (error, results) => {
      if (error) {
        return res.status(500).json({ message: error.message });
      }
      res.json(results);
    });
  }catch(err){
    console.error('getVisitors Controller error :', error.message);
    res.status(500).send('getVisitors Controller error');
  }
};

const getRegistrations = (req, res) => {
  try{
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
  } catch(err){
    console.error('getRegistrations Controller error :', error.message);
    res.status(500).send('getRegistrations Controller error');
  }
};

const getTotalMembers = (req, res) => {
  try{
    const type = req.params.type;

    analysisService.getTotalMembers(type, (error, results) => {
      if (error) {
        return res.status(500).json({ message: error.message });
      }
      res.json(results);
    });
  }catch(err){
    console.error('getTotalMembers Controller error :', error.message);
    res.status(500).send('getTotalMembers Controller error');
  }
};

const getGenderAndAgeStats = (req, res) => {
  try{
    analysisService.getGenderAndAgeStats((error, stats) => {
      if (error) {
        console.error('성별 및 연령대 집계 중 오류 발생:', error.message);
        return res.status(500).send('성별 및 연령대 집계 중 오류가 발생했습니다.');
      }
      res.json(stats);
    });
  }catch(err){
    console.error('getGenderAndAgeStats Controller error :', error.message);
    res.status(500).send('getGenderAndAgeStats Controller error');
  }
};

const getPostAnalysis = (req, res) => {
  try{
    const type = req.params.type;

    analysisService.getPostCounts(type, (error, results) => {
      if (error) {
        console.error('분석 데이터 불러오기 실패:', error.message);
        return res.status(500).send('분석 데이터를 불러오는 중 오류가 발생했습니다.');
      }
      res.json(results);
    });
  }catch(err){
    console.error('getPostAnalysis Controller error :', error.message);
    res.status(500).send('getPostAnalysis Controller error');
  }
};

const getPostsByCategory = (req, res) => {
  try{
    const date = req.params.date;  // :date를 통해 받은 날짜 파라미터

      analysisService.getPostsByCategory(date, (error, results) => {
          if (error) {
              console.error('게시글 카테고리별 조회 실패:', error.message);
              return res.status(500).send('게시글 카테고리별 조회 중 오류가 발생했습니다.');
          }
          res.json(results);
      });
  }catch(err){
    console.error('getPostsByCategory Controller error :', error.message);
    res.status(500).send('getPostsByCategory Controller error');
  }
};

const getAllPostsByCategory = (req, res) => {
  try{
    analysisService.getAllPostsByCategory((error, results) => {
      if (error) {
          console.error('카테고리별 게시글 카운트 불러오기 실패:', error.message);
          return res.status(500).send('카테고리별 게시글 카운트 불러오는 중 오류가 발생했습니다.');
      }
      res.json(results);
  });
  }catch(err){
    console.error('getAllPostsByCategory Controller error :', error.message);
    res.status(500).send('getAllPostsByCategory Controller error');
  }
};


module.exports = {
  getVisitors, 
  getRegistrations,
  getTotalMembers,
  getGenderAndAgeStats,  
  getPostAnalysis,
  getPostsByCategory,
  getAllPostsByCategory,
};
