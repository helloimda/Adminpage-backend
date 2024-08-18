const postmanageService = require('../services/postmanageService');

const getNotices = (req, res) => {
  const page = parseInt(req.params.page) || 1; // URL에서 페이지 번호를 가져옵니다.

  postmanageService.getNotices(page, (error, results) => {
    if (error) {
      console.error('공지사항 불러오기 실패:', error.message);
      return res.status(500).send('공지사항을 불러오는 중 오류가 발생했습니다.');
    }
    res.json(results);
  });
};

const getPostDetail = (req, res) => {
  const bo_idx = req.params.id;

  postmanageService.getPostDetail(bo_idx, (error, postDetail) => {
    if (error) {
      console.error('게시글 불러오기 실패:', error.message);
      return res.status(500).send('게시글을 불러오는 중 오류가 발생했습니다.');
    }
    res.json(postDetail);
  });
};

module.exports = {
  getPostDetail,
  getNotices,
};
