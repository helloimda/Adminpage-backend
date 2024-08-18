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

const getPostNoticeDetail = (req, res) => {
  const bo_idx = req.params.id;

  postmanageService.getPostNoticeDetail(bo_idx, (error, postDetail) => {
    if (error) {
      console.error('게시글 불러오기 실패:', error.message);
      return res.status(500).send('게시글을 불러오는 중 오류가 발생했습니다.');
    }
    res.json(postDetail);
  });
};

const updatePostNoticeDetail = (req, res) => {
    const bo_idx = req.params.id;
    const { subject, content } = req.body; // 사용자가 전송한 데이터
  
    postmanageService.updatePostNoticeDetail(bo_idx, subject, content, (error, result) => {
      if (error) {
        console.error('게시글 업데이트 실패:', error.message);
        return res.status(500).send('게시글을 업데이트하는 중 오류가 발생했습니다.');
      }
      res.send('게시글이 성공적으로 업데이트되었습니다.');
    });
  };

  const searchPostsBySubject = (req, res) => {
    const searchTerm = req.query.q;
    const page = parseInt(req.query.page) || 1;
  
    postmanageService.searchPostsBySubject(searchTerm, page, (error, results) => {
      if (error) {
        console.error('게시글 검색 실패:', error.message);
        return res.status(500).send('게시글 검색 중 오류가 발생했습니다.');
      }
      res.json(results);
    });
  };
  
  const searchPostsByContent = (req, res) => {
    const searchTerm = req.query.q;
    const page = parseInt(req.query.page) || 1;
  
    postmanageService.searchPostsByContent(searchTerm, page, (error, results) => {
      if (error) {
        console.error('게시글 검색 실패:', error.message);
        return res.status(500).send('게시글 검색 중 오류가 발생했습니다.');
      }
      res.json(results);
    });
  };

  const searchPostsByNick = (req, res) => {
    const searchTerm = req.query.q;
    const page = parseInt(req.query.page) || 1;
  
    postmanageService.searchPostsByNick(searchTerm, page, (error, results) => {
      if (error) {
        console.error('게시글 닉네임 검색 실패:', error.message);
        return res.status(500).send('게시글 닉네임 검색 중 오류가 발생했습니다.');
      }
      res.json(results);
    });
  };

  const deleteMultiplePosts = (req, res) => {
    const postIds = req.body.postIds; // 삭제할 게시글 ID 배열
    const deldt = new Date(); // 삭제 시점의 타임스탬프
  
    postmanageService.deleteMultiplePosts(postIds, deldt, (error, result) => {
      if (error) {
        console.error('게시글 삭제 실패:', error.message);
        return res.status(500).send('게시글 삭제 중 오류가 발생했습니다.');
      }
      res.send('게시글이 성공적으로 삭제되었습니다.');
    });
  };
  
module.exports = {
  getPostNoticeDetail,
  getNotices,
  updatePostNoticeDetail,
  searchPostsBySubject,  
  searchPostsByContent,   
  searchPostsByNick,
  deleteMultiplePosts, 
};
