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
                data: results,
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
          data: results,
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
        data: results,
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
  const searchTerm = req.params.id; // req.query.q 대신 req.params.id 사용
  const page = parseInt(req.params.page) || 1;
  const limit = 10;

  postmanageService.searchGeneralPostsByContent(searchTerm, page, limit, (error, results) => {
      if (error) {
          console.error('일반 게시글 내용 검색 실패:', error.message);
          return res.status(500).send('일반 게시글 내용 검색 중 오류가 발생했습니다.');
      }

      postmanageService.getGeneralPostsCountByContent(searchTerm, (error, totalPosts) => {
          if (error) {
              console.error('총 게시글 수 조회 실패:', error.message);
              return res.status(500).send('총 게시글 수 조회 중 오류가 발생했습니다.');
          }

          const totalPages = Math.ceil(totalPosts / limit);
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

  
const searchGeneralPostsByNick = (req, res) => {
  const searchTerm = req.params.id;
  const page = parseInt(req.params.page) || 1;
  const limit = 10;

  postmanageService.searchGeneralPostsByNick(searchTerm, page, limit, (error, results) => {
    if (error) {
      console.error('일반 게시글 닉네임 검색 실패:', error.message);
      return res.status(500).send('일반 게시글 닉네임 검색 중 오류가 발생했습니다.');
    }
    res.json({
        data: results,
        pagination: {
            previousPage: page > 1 ? page - 1 : null,
            nextPage: results.length === limit ? page + 1 : null,
            currentPage: page,
            totalPages: results.length === limit ? page + 1 : page,
        },
    });
  });
};




  
const getFraudPosts = (req, res) => {
  const page = parseInt(req.params.page) || 1;
  const limit = 10;

  postmanageService.getFraudPostsCount((error, totalPosts) => {
      if (error) {
          console.error('사기 피해 게시글 수 조회 실패:', error.message);
          return res.status(500).send('사기 피해 게시글 수 조회 중 오류가 발생했습니다.');
      }

      const totalPages = Math.ceil(totalPosts / limit);
      const previousPage = page > 1 ? page - 1 : null;
      const nextPage = page < totalPages ? page + 1 : null;

      postmanageService.getFraudPosts(page, limit, (error, results) => {
          if (error) {
              console.error('사기 피해 게시글 불러오기 실패:', error.message);
              return res.status(500).send('사기 피해 게시글을 불러오는 중 오류가 발생했습니다.');
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
  

  const deleteFraudPost = (req, res) => {
    const postId = req.params.id; // URL 파라미터로 받은 게시글 ID
    const deldt = new Date(); // 삭제 시점의 타임스탬프
  
    postmanageService.deleteFraudPost(postId, deldt, (error, result) => {
      if (error) {
        console.error('사기 피해 게시글 삭제 실패:', error.message);
        return res.status(500).send('사기 피해 게시글 삭제 중 오류가 발생했습니다.');
      }
      if (result.affectedRows === 0) {
        return res.status(404).send('해당 게시글을 찾을 수 없습니다.');
      }
      res.send('사기 피해 게시글이 성공적으로 삭제되었습니다.');
    });
  };
  
  
  const searchFraudPostsByGoodName = (req, res) => {
    const searchTerm = req.params.id;  // req.query.q 대신 req.params.id 사용
    const page = parseInt(req.params.page) || 1;
    const limit = 10;

    postmanageService.searchFraudPostsByGoodName(searchTerm, page, limit, (error, results) => {
        if (error) {
            console.error('사기 피해 게시글 상품명 검색 실패:', error.message);
            return res.status(500).send('사기 피해 게시글 상품명 검색 중 오류가 발생했습니다.');
        }

        // 페이지네이션 관련 코드 추가
        const totalPages = results.length === limit ? page + 1 : page;
        const previousPage = page > 1 ? page - 1 : null;
        const nextPage = results.length === limit ? page + 1 : null;

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
};

  
  const searchFraudPostsByMemId = (req, res) => {
    const searchTerm = req.params.id;  // req.query.q 대신 req.params.id 사용
    const page = parseInt(req.params.page) || 1;
    const limit = 10;

    postmanageService.searchFraudPostsByMemId(searchTerm, page, limit, (error, results) => {
        if (error) {
            console.error('사기 피해 게시글 회원 ID 검색 실패:', error.message);
            return res.status(500).send('사기 피해 게시글 회원 ID 검색 중 오류가 발생했습니다.');
        }
        
        const totalPages = results.length === limit ? page + 1 : page;

        res.json({
            data: results,
            pagination: {
                previousPage: page > 1 ? page - 1 : null,
                nextPage: results.length === limit ? page + 1 : null,
                currentPage: page,
                totalPages: totalPages,
            },
        });
    });
};


const getCommentsByPostId = (req, res) => {
  const bo_idx = req.params.id;

  postmanageService.getCommentsByPostId(bo_idx, (error, comments) => {
      if (error) {
          console.error('댓글 불러오기 실패:', error.message);
          return res.status(500).send('댓글을 불러오는 중 오류가 발생했습니다.');
      }
      res.json(comments);
  });
};

const getFraudCommentsByPostId = (req, res) => {
  const bof_idx = req.params.bof_idx;

  postmanageService.getFraudCommentsByPostId(bof_idx, (error, comments) => {
      if (error) {
          console.error('사기 피해 게시글 댓글 불러오기 실패:', error.message);
          return res.status(500).send('사기 피해 게시글 댓글을 불러오는 중 오류가 발생했습니다.');
      }
      res.json(comments);
  });
};

const deleteComment = (req, res) => {
  const cmt_idx = req.params.cmt_idx;
  const deldt = new Date(); // 현재 시간으로 타임스탬프 설정

  postmanageService.deleteComment(cmt_idx, deldt, (error, result) => {
      if (error) {
          console.error('댓글 삭제 실패:', error.message);
          return res.status(500).send('댓글 삭제 중 오류가 발생했습니다.');
      }
      if (result.affectedRows === 0) {
          return res.status(404).send('해당 댓글을 찾을 수 없습니다.');
      }
      res.send('댓글이 성공적으로 삭제되었습니다.');
  });
};

const deleteFraudComment = (req, res) => {
  const bofc_idx = req.params.bofc_idx;
  const deldt = new Date(); // 현재 시간으로 타임스탬프 설정

  postmanageService.deleteFraudComment(bofc_idx, deldt, (error, result) => {
      if (error) {
          console.error('사기 피해 댓글 삭제 실패:', error.message);
          return res.status(500).send('사기 피해 댓글 삭제 중 오류가 발생했습니다.');
      }
      if (result.affectedRows === 0) {
          return res.status(404).send('해당 댓글을 찾을 수 없습니다.');
      }
      res.send('사기 피해 댓글이 성공적으로 삭제되었습니다.');
  });
};


const createNoticePost = (req, res) => {
    const { mem_idx, mem_id, subject, content, tags, istemp } = req.body;

    // 현재 시간을 regdt에 사용하기 위해
    const regdt = new Date();

    // 서비스를 통해 게시글을 생성
    postmanageService.createNoticePost(mem_idx, mem_id, subject, content, tags, istemp, regdt, (error, result) => {
        if (error) {
            console.error('공지사항 생성 실패:', error.message);
            return res.status(500).send('공지사항 생성 중 오류가 발생했습니다.');
        }
        res.status(201).json({ message: '공지사항이 성공적으로 생성되었습니다.', bo_idx: result.insertId });
    });
};
const deleteNoticeImage = (req, res) => {
  const { bo_idx, img_idx } = req.params;
  const deldt = new Date();  // 현재 타임스탬프

  postmanageService.deleteNoticeImage(bo_idx, img_idx, deldt, (error, result) => {
      if (error) {
          console.error('공지사항 이미지 삭제 실패:', error.message);
          return res.status(500).send('공지사항 이미지 삭제 중 오류가 발생했습니다.');
      }
      res.send('공지사항 이미지가 성공적으로 삭제되었습니다.');
  });
};

const getCommentList = (req, res) => {
  const page = parseInt(req.params.page) || 1;
  const limit = 10; // 한 페이지에 표시할 댓글 수
  const offset = (page - 1) * limit;

  postmanageService.getCommentsWithPagination(limit, offset, (error, results) => {
      if (error) {
          console.error('댓글 리스트 가져오기 실패:', error.message);
          return res.status(500).send('댓글 리스트를 가져오는 중 오류가 발생했습니다.');
      }
      
      postmanageService.getCommentCount((error, totalComments) => {
          if (error) {
              console.error('총 댓글 수 가져오기 실패:', error.message);
              return res.status(500).send('총 댓글 수를 가져오는 중 오류가 발생했습니다.');
          }

          const totalPages = Math.ceil(totalComments / limit);
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

const getCommentDetailByPost = (req, res) => {
  const bo_idx = parseInt(req.params.bo_idx);
  const page = parseInt(req.params.page) || 1;
  const limit = 10; // 한 페이지에 표시할 댓글 수
  const offset = (page - 1) * limit;

  postmanageService.getCommentsByPostWithPagination(bo_idx, limit, offset, (error, results) => {
      if (error) {
          console.error('댓글 리스트 가져오기 실패:', error.message);
          return res.status(500).send('댓글 리스트를 가져오는 중 오류가 발생했습니다.');
      }

      postmanageService.getCommentCountByPost(bo_idx, (error, totalComments) => {
          if (error) {
              console.error('총 댓글 수 가져오기 실패:', error.message);
              return res.status(500).send('총 댓글 수를 가져오는 중 오류가 발생했습니다.');
          }

          const totalPages = Math.ceil(totalComments / limit);
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

const getFraudComments = (req, res) => {
  const page = parseInt(req.params.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  postmanageService.getFraudComments(offset, limit, (error, results) => {
      if (error) {
          console.error('사기 피해 댓글 불러오기 실패:', error.message);
          return res.status(500).send('사기 피해 댓글을 불러오는 중 오류가 발생했습니다.');
      }

      // 페이지네이션 정보 생성
      postmanageService.getFraudCommentsCount((error, totalComments) => {
          if (error) {
              console.error('사기 피해 댓글 수 조회 실패:', error.message);
              return res.status(500).send('사기 피해 댓글 수를 조회하는 중 오류가 발생했습니다.');
          }

          const totalPages = Math.ceil(totalComments / limit);
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

const getFraudCommentsByPost = (req, res) => {
  const bof_idx = req.params.bof_idx;
  const page = parseInt(req.params.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  postmanageService.getFraudCommentsByPost(bof_idx, offset, limit, (error, results) => {
      if (error) {
          console.error('사기 피해 게시글 댓글 불러오기 실패:', error.message);
          return res.status(500).send('사기 피해 게시글 댓글을 불러오는 중 오류가 발생했습니다.');
      }

      // 페이지네이션 정보 생성
      postmanageService.getFraudCommentsCountByPost(bof_idx, (error, totalComments) => {
          if (error) {
              console.error('사기 피해 게시글 댓글 수 조회 실패:', error.message);
              return res.status(500).send('사기 피해 게시글 댓글 수를 조회하는 중 오류가 발생했습니다.');
          }

          const totalPages = Math.ceil(totalComments / limit);
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
    deleteFraudPost,
    searchFraudPostsByGoodName,
    searchFraudPostsByMemId,  
    getCommentsByPostId,
    getFraudCommentsByPostId,
    deleteComment,
    deleteFraudComment,
    createNoticePost,
    deleteNoticeImage,
    getCommentList,
    getCommentDetailByPost,
    getFraudComments,
    getFraudCommentsByPost,
  };
  