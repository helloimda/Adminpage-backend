const postmanageService = require('../services/postmanageService');

const getNotices = (req, res) => {
  const page = parseInt(req.params.page) || 1; // URL에서 페이지 번호를 가져옵니다.
  const limit = 10;

  postmanageService.getNotices(page, limit, (error, results) => {
    if (error) {
      console.error('공지사항 불러오기 실패:', error.message);
      return res.status(500).send('공지사항을 불러오는 중 오류가 발생했습니다.');
    }

    postmanageService.getNoticesCount((error, totalNotices) => {
      if (error) {
        console.error('공지사항 수 조회 실패:', error.message);
        return res.status(500).send('공지사항 수를 조회하는 중 오류가 발생했습니다.');
      }

      const totalPages = Math.ceil(totalNotices / limit);
      const previousPage = page > 1 ? page - 1 : null;
      const nextPage = page < totalPages ? page + 1 : null;

      res.json({
        data: results,
        pagination: {
          previousPage,
          nextPage,
          currentPage: page,
          totalPages,
        },
      });
    });
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
    const searchTerm = req.params.name;
    const page = parseInt(req.params.page) || 1;

    postmanageService.searchPostsBySubject(searchTerm, page, (error, results) => {
        if (error) {
            console.error('게시글 검색 실패:', error.message);
            return res.status(500).send('게시글 검색 중 오류가 발생했습니다.');
        }

        postmanageService.getTotalCountBySubject(searchTerm, (error, totalCount) => {
            if (error) {
                console.error('총 게시글 수 조회 실패:', error.message);
                return res.status(500).send('총 게시글 수 조회 중 오류가 발생했습니다.');
            }

            const totalPages = Math.ceil(totalCount / 10);
            const previousPage = page > 1 ? page - 1 : null;
            const nextPage = page < totalPages ? page + 1 : null;

            res.json({
                results: results,
                pagination: {
                    previousPage: previousPage,
                    nextPage: nextPage,
                    currentPage: page,
                    totalPages: totalPages
                }
            });
        });
    });
};


  
const searchPostsByContent = (req, res) => {
  const searchTerm = req.params.name;
  const page = parseInt(req.params.page) || 1;

  postmanageService.searchPostsByContent(searchTerm, page, (error, results) => {
      if (error) {
          console.error('게시글 검색 실패:', error.message);
          return res.status(500).send('게시글 검색 중 오류가 발생했습니다.');
      }

      const totalPages = Math.ceil(results.length / 10);
      const pagination = {
          previousPage: page > 1 ? page - 1 : null,
          nextPage: page < totalPages ? page + 1 : null,
          currentPage: page,
          totalPages: totalPages,
      };

      res.json({
          results: results,
          pagination: pagination
      });
  });
};



const searchPostsByNick = (req, res) => {
  const searchTerm = req.params.name;
  const page = parseInt(req.params.page) || 1;

  postmanageService.searchPostsByNick(searchTerm, page, (error, results, totalResults) => {
    if (error) {
      console.error('게시글 닉네임 검색 실패:', error.message);
      return res.status(500).send('게시글 닉네임 검색 중 오류가 발생했습니다.');
    }
    
    const totalPages = Math.ceil(totalResults / 10);
    const pagination = {
        previousPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        currentPage: page,
        totalPages: totalPages,
    };

    res.json({
        results: results,
        pagination: pagination,
    });
  });
};

  const deletePost = (req, res) => {
    const postId = req.params.id; // URL 파라미터로 받은 게시글 ID
    const deldt = new Date(); // 삭제 시점의 타임스탬프

    postmanageService.deletePost(postId, deldt, (error, result) => {
        if (error) {
            console.error('게시글 삭제 실패:', error.message);
            return res.status(500).send('게시글 삭제 중 오류가 발생했습니다.');
        }
        res.send('게시글이 성공적으로 삭제되었습니다.');
    });
};


const getGeneralPosts = (req, res) => {
  const page = parseInt(req.params.page) || 1;
  const limit = 10;

  postmanageService.getGeneralPostsCount((error, totalPosts) => {
      if (error) {
          console.error('게시글 수 조회 실패:', error.message);
          return res.status(500).send('게시글 수를 조회하는 중 오류가 발생했습니다.');
      }

      const totalPages = Math.ceil(totalPosts / limit);
      const previousPage = page > 1 ? page - 1 : null;
      const nextPage = page < totalPages ? page + 1 : null;

      postmanageService.getGeneralPosts(page, limit, (error, results) => {
          if (error) {
              console.error('일반 게시글 불러오기 실패:', error.message);
              return res.status(500).send('일반 게시글을 불러오는 중 오류가 발생했습니다.');
          }

          res.json({
              data: results,
              pagination: {
                  previousPage,
                  nextPage,
                  currentPage: page,
                  totalPages,
              },
          });
      });
  });
};

  const getGeneralPostDetail = (req, res) => {
    const bo_idx = req.params.id;
  
    postmanageService.getGeneralPostDetail(bo_idx, (error, postDetail) => {
      if (error) {
        console.error('일반 게시글 불러오기 실패:', error.message);
        return res.status(500).send('일반 게시글을 불러오는 중 오류가 발생했습니다.');
      }
      res.json(postDetail);
    });
  };
  
  
  const deleteGeneralPost = (req, res) => {
    const postId = req.params.id;  // URL 파라미터에서 게시글 ID를 받음
    const deldt = new Date();  // 현재 시간으로 deldt 설정

    postmanageService.deleteGeneralPost(postId, deldt, (error, result) => {
        if (error) {
            console.error('일반 게시글 삭제 실패:', error.message);
            return res.status(500).send('일반 게시글 삭제 중 오류가 발생했습니다.');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('해당 게시글을 찾을 수 없습니다.');
        }
        res.send('일반 게시글이 성공적으로 삭제되었습니다.');
    });
};

  
const searchGeneralPostsBySubject = (req, res) => {
  const searchTerm = req.params.id;
  const page = parseInt(req.params.page) || 1;
  const limit = 10;

  postmanageService.getGeneralPostsCountBySubject(searchTerm, (error, totalPosts) => {
      if (error) {
          console.error('총 게시글 수 조회 실패:', error.message);
          return res.status(500).send('총 게시글 수 조회 중 오류가 발생했습니다.');
      }

      const totalPages = Math.ceil(totalPosts / limit);
      const previousPage = page > 1 ? page - 1 : null;
      const nextPage = page < totalPages ? page + 1 : null;

      postmanageService.searchGeneralPostsBySubject(searchTerm, page, limit, (error, results) => {
          if (error) {
              console.error('일반 게시글 제목 검색 실패:', error.message);
              return res.status(500).send('일반 게시글 제목 검색 중 오류가 발생했습니다.');
          }
          res.json({
              data: results,
              pagination: {
                  previousPage,
                  nextPage,
                  currentPage: page,
                  totalPages,
              },
          });
      });
  });
};


  
  const searchGeneralPostsByContent = (req, res) => {
    const searchTerm = req.query.q;
    const page = parseInt(req.query.page) || 1;
  
    postmanageService.searchGeneralPostsByContent(searchTerm, page, (error, results) => {
      if (error) {
        console.error('일반 게시글 내용 검색 실패:', error.message);
        return res.status(500).send('일반 게시글 내용 검색 중 오류가 발생했습니다.');
      }
      res.json(results);
    });
  };
  
  const searchGeneralPostsByNick = (req, res) => {
    const searchTerm = req.query.q;
    const page = parseInt(req.query.page) || 1;
  
    postmanageService.searchGeneralPostsByNick(searchTerm, page, (error, results) => {
      if (error) {
        console.error('일반 게시글 닉네임 검색 실패:', error.message);
        return res.status(500).send('일반 게시글 닉네임 검색 중 오류가 발생했습니다.');
      }
      res.json(results);
    });
  };
  
  const getFraudPosts = (req, res) => {
    const page = parseInt(req.params.page) || 1;
  
    postmanageService.getFraudPosts(page, (error, results) => {
      if (error) {
        console.error('사기 피해 게시글 불러오기 실패:', error.message);
        return res.status(500).send('사기 피해 게시글을 불러오는 중 오류가 발생했습니다.');
      }
      res.json(results);
    });
  };
  const getFraudPostDetail = (req, res) => {
    const bof_idx = req.params.id;
  
    postmanageService.getFraudPostDetail(bof_idx, (error, postDetail) => {
      if (error) {
        console.error('사기 피해 게시글 불러오기 실패:', error.message);
        return res.status(500).send('사기 피해 게시글을 불러오는 중 오류가 발생했습니다.');
      }
      res.json(postDetail);
    });
  };
  

  
  const deleteMultipleFraudPosts = (req, res) => {
    const postIds = req.body.postIds;
    const deldt = new Date();
  
    postmanageService.deleteMultipleFraudPosts(postIds, deldt, (error, result) => {
      if (error) {
        console.error('사기 피해 게시글 삭제 실패:', error.message);
        return res.status(500).send('사기 피해 게시글 삭제 중 오류가 발생했습니다.');
      }
      res.send('사기 피해 게시글이 성공적으로 삭제되었습니다.');
    });
  };
  
  
  const searchFraudPostsByGoodName = (req, res) => {
    const searchTerm = req.query.q;
    const page = parseInt(req.query.page) || 1;
  
    postmanageService.searchFraudPostsByGoodName(searchTerm, page, (error, results) => {
      if (error) {
        console.error('사기 피해 게시글 상품명 검색 실패:', error.message);
        return res.status(500).send('사기 피해 게시글 상품명 검색 중 오류가 발생했습니다.');
      }
      res.json(results);
    });
  };
  
  const searchFraudPostsByMemId = (req, res) => {
    const searchTerm = req.query.q;
    const page = parseInt(req.query.page) || 1;
  
    postmanageService.searchFraudPostsByMemId(searchTerm, page, (error, results) => {
      if (error) {
        console.error('사기 피해 게시글 회원 ID 검색 실패:', error.message);
        return res.status(500).send('사기 피해 게시글 회원 ID 검색 중 오류가 발생했습니다.');
      }
      res.json(results);
    });
  };

  module.exports = {
    getNotices,
    getPostNoticeDetail,
    updatePostNoticeDetail,
    deletePost,
    searchPostsBySubject,
    searchPostsByContent,
    searchPostsByNick,
    getGeneralPosts,
    getGeneralPostDetail,
    deleteGeneralPost,
    searchGeneralPostsBySubject,
    searchGeneralPostsByContent,
    searchGeneralPostsByNick,
    getFraudPosts,
    getFraudPostDetail,
    deleteMultipleFraudPosts,
    searchFraudPostsByGoodName,
    searchFraudPostsByMemId,  
  };
  