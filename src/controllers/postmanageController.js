const postmanageService = require('../services/postmanageService');
const { connection } = require('../config/db');


const addNoticeImage = async (req, res) => {
  try {
      const bo_idx = req.params.bo_idx;
      const { originalname, mimetype, size, buffer } = req.file;

      // S3 업로드 서비스 호출
      const location = await postmanageService.uploadImageToS3(originalname, mimetype, buffer);

      // DB에 이미지 정보 저장 서비스 호출
      postmanageService.addNoticeImage(bo_idx, originalname, mimetype, size, location, (error, result) => {
          if (error) {
              console.error('DB에 이미지 정보 저장 실패:', error.message);
              return res.status(500).send('DB에 이미지 정보 저장 중 오류가 발생했습니다.');
          }
          res.status(201).json({ message: '이미지가 성공적으로 업로드되었습니다.', file_url: location });
      });
  } catch (error) {
      console.error('S3 이미지 업로드 실패:', error.message);
      return res.status(500).send('이미지 업로드 중 오류가 발생했습니다.');
  }
};




const getNotices = (req, res) => {
  try{
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
  }catch(error){
    console.error('getNotices Controller error :', error.message);
    res.status(500).send('getNotices Controller error');
  }
};


const getPostNoticeDetail = (req, res) => {
  try{
    const bo_idx = req.params.id;

    postmanageService.getPostNoticeDetail(bo_idx, (error, postDetail) => {
      if (error) {
        console.error('게시글 불러오기 실패:', error.message);
        return res.status(500).send('게시글을 불러오는 중 오류가 발생했습니다.');
      }
      res.json(postDetail);
    });
  }catch(error){
    console.error('getPostNoticeDetail Controller error :', error.message);
    res.status(500).send('getPostNoticeDetail Controller error');
  }
};

const updatePostNoticeDetail = (req, res) => {
    try{
      const bo_idx = req.params.id;
      const { subject, content } = req.body; // 사용자가 전송한 데이터
    
      postmanageService.updatePostNoticeDetail(bo_idx, subject, content, (error, result) => {
        if (error) {
          console.error('게시글 업데이트 실패:', error.message);
          return res.status(500).send('게시글을 업데이트하는 중 오류가 발생했습니다.');
        }
        res.send('게시글이 성공적으로 업데이트되었습니다.');
      });
    }catch(error){
      console.error('updatePostNoticeDetail Controller error :', error.message);
      res.status(500).send('updatePostNoticeDetail Controller error');
    }
  };

  const searchPostsBySubject = (req, res) => {
    try{
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
  }catch(error){
      console.error('searchPostsBySubject Controller error :', error.message);
      res.status(500).send('searchPostsBySubject Controller error');
  }
};


  
const searchPostsByContent = (req, res) => {
  try{
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
    }catch(error){
      console.error('searchPostsBySubject Controller error :', error.message);
      res.status(500).send('searchPostsBySubject Controller error');
  }
};



const searchPostsByNick = (req, res) => {
  try{
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
  }catch(error){
    console.error('searchPostsByNick Controller error :', error.message);
    res.status(500).send('searchPostsByNick Controller error');
}
};

  const deletePost = (req, res) => {
    try{
      const postId = req.params.id; // URL 파라미터로 받은 게시글 ID
      const deldt = new Date(); // 삭제 시점의 타임스탬프

      postmanageService.deletePost(postId, deldt, (error, result) => {
          if (error) {
              console.error('게시글 삭제 실패:', error.message);
              return res.status(500).send('게시글 삭제 중 오류가 발생했습니다.');
          }
          res.send('게시글이 성공적으로 삭제되었습니다.');
      });
    }catch(error){
      console.error('deletePost Controller error :', error.message);
      res.status(500).send('deletePost Controller error');
  }
};


const getGeneralPosts = (req, res) => {
  try{
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
  }catch(error){
    console.error('getGeneralPosts Controller error :', error.message);
    res.status(500).send('getGeneralPosts Controller error');
  }
};

  const getGeneralPostDetail = (req, res) => {
    try{
      const bo_idx = req.params.id;
  
      postmanageService.getGeneralPostDetail(bo_idx, (error, postDetail) => {
        if (error) {
          console.error('일반 게시글 불러오기 실패:', error.message);
          return res.status(500).send('일반 게시글을 불러오는 중 오류가 발생했습니다.');
        }
        res.json(postDetail);
      });
    }catch(error){
      console.error('getGeneralPosts Controller error :', error.message);
      res.status(500).send('getGeneralPosts Controller error');
    }
  };
  
  
  const deleteGeneralPost = (req, res) => {
    try{
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
    }catch(error){
      console.error('deleteGeneralPost Controller error :', error.message);
      res.status(500).send('deleteGeneralPost Controller error');
    }
};

  
const searchGeneralPostsBySubject = (req, res) => {
  try{
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
  }catch(error){
    console.error('searchGeneralPostsBySubject Controller error :', error.message);
    res.status(500).send('searchGeneralPostsBySubject Controller error');
  }
};


  
const searchGeneralPostsByContent = (req, res) => {
  try{
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
  }catch(error){
    console.error('getGeneralPostsCountByContent Controller error :', error.message);
    res.status(500).send('getGeneralPostsCountByContent Controller error');
  }
};

  
const searchGeneralPostsByNick = (req, res) => {
  try{
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
  }catch(error){
    console.error('searchGeneralPostsByNick Controller error :', error.message);
    res.status(500).send('searchGeneralPostsByNick Controller error');
  }
};




  
const getFraudPosts = (req, res) => {
  try{
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
  }catch(error){
    console.error('getFraudPosts Controller error :', error.message);
    res.status(500).send('getFraudPosts Controller error');
  }
};



  const getFraudPostDetail = (req, res) => {
   try{
    const bof_idx = req.params.id;
  
    postmanageService.getFraudPostDetail(bof_idx, (error, postDetail) => {
      if (error) {
        console.error('사기 피해 게시글 불러오기 실패:', error.message);
        return res.status(500).send('사기 피해 게시글을 불러오는 중 오류가 발생했습니다.');
      }
      res.json(postDetail);
    });
   }catch(error){
    console.error('getFraudPostDetail Controller error :', error.message);
    res.status(500).send('getFraudPostDetail Controller error');
    }
  };
  

  const deleteFraudPost = (req, res) => {
    try{
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
    }catch(error){
      console.error('deleteFraudPost Controller error :', error.message);
      res.status(500).send('deleteFraudPost Controller error');
      }
  };
  
  
  const searchFraudPostsByGoodName = (req, res) => {
    try{
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
    }catch(error){
      console.error('searchFraudPostsByGoodName Controller error :', error.message);
      res.status(500).send('searchFraudPostsByGoodName Controller error');
      }
};

  
  const searchFraudPostsByMemId = (req, res) => {
    try{
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
    }catch(error){
      console.error('searchFraudPostsByMemId Controller error :', error.message);
      res.status(500).send('searchFraudPostsByMemId Controller error');
      }
};


const getCommentsByPostId = (req, res) => {
  try{
    const bo_idx = req.params.id;

    postmanageService.getCommentsByPostId(bo_idx, (error, comments) => {
        if (error) {
            console.error('댓글 불러오기 실패:', error.message);
            return res.status(500).send('댓글을 불러오는 중 오류가 발생했습니다.');
        }
        res.json(comments);
    });
  }catch(error){
    console.error('getCommentsByPostId Controller error :', error.message);
    res.status(500).send('getCommentsByPostId Controller error');
    }
};

const getFraudCommentsByPostId = (req, res) => {
  try{
    const bof_idx = req.params.bof_idx;

    postmanageService.getFraudCommentsByPostId(bof_idx, (error, comments) => {
        if (error) {
            console.error('사기 피해 게시글 댓글 불러오기 실패:', error.message);
            return res.status(500).send('사기 피해 게시글 댓글을 불러오는 중 오류가 발생했습니다.');
        }
        res.json(comments);
    });
  }catch(error){
    console.error('getFraudCommentsByPostId Controller error :', error.message);
    res.status(500).send('getFraudCommentsByPostId Controller error');
    }
};

const deleteComment = (req, res) => {
  try{
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
  }catch(error){
    console.error('deleteComment Controller error :', error.message);
    res.status(500).send('deleteComment Controller error');
    }
};

const deleteFraudComment = (req, res) => {
  try{
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
  }catch(error){
    console.error('deleteFraudComment Controller error :', error.message);
    res.status(500).send('deleteFraudComment Controller error');
    }
};


const createNoticePost = (req, res) => {
    try{
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
    }catch(error){
      console.error('createNoticePost Controller error :', error.message);
      res.status(500).send('createNoticePost Controller error');
      }
};

const returnUserInfo = (req, res) => {
  try{
    if (req.user) {
      console.log('컨트롤러에서 사용자 정보:', req.user);  // 사용자 정보 로깅
      res.json({ mem_id: req.user.mem_id });
    } else {
        res.status(404).json({ message: '사용자 정보를 찾을 수 없습니다.' });
    }
  }catch(error){
    console.error(' returnUserInfo Controller error :', error.message);
    res.status(500).send(' returnUserInfo Controller error');
    }
};




const deleteNoticeImage = (req, res) => {
 try{
  const { bo_idx, img_idx } = req.params;
  const deldt = new Date();  // 현재 타임스탬프

  postmanageService.deleteNoticeImage(bo_idx, img_idx, deldt, (error, result) => {
      if (error) {
          console.error('공지사항 이미지 삭제 실패:', error.message);
          return res.status(500).send('공지사항 이미지 삭제 중 오류가 발생했습니다.');
      }
      res.send('공지사항 이미지가 성공적으로 삭제되었습니다.');
  });
 }catch(error){
  console.error('deleteNoticeImage Controller error :', error.message);
  res.status(500).send('deleteNoticeImage Controller error');
  }
};

const getCommentList = (req, res) => {
  try{
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
  }catch(error){
    console.error('getCommentCount Controller error :', error.message);
    res.status(500).send('getCommentCount Controller error');
    }
};

const getCommentDetailByPost = (req, res) => {
  try{
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
  }catch(error){
    console.error('getCommentCountByPost Controller error :', error.message);
    res.status(500).send('getCommentCountByPost Controller error');
    }
};

const getFraudComments = (req, res) => {
  try{
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
  }catch(error){
    console.error('ggetFraudCommentsCount Controller error :', error.message);
    res.status(500).send('getFraudCommentsCount Controller error');
    }
};

const getFraudCommentsByPost = (req, res) => {
 try{
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
 }catch(error){
  console.error('getFraudCommentsCountByPost Controller error :', error.message);
  res.status(500).send('getFraudCommentsCountByPost Controller error');
  }
};

const searchCommentsByNickname = (req, res) => {
  try{
    const mem_id = req.params.mem_id;
  const page = parseInt(req.params.page) || 1;
  const limit = 10;  // 한 페이지당 10개의 결과를 보여줌
  const offset = (page - 1) * limit;

  postmanageService.searchCommentsByNickname(mem_id, limit, offset, (error, results) => {
    if (error) {
      console.error('댓글 검색 실패:', error.message);
      return res.status(500).send('댓글 검색 중 오류가 발생했습니다.');
    }

    // 전체 댓글 수를 조회하여 페이지네이션 정보를 추가
    postmanageService.getCommentsCountByNickname(mem_id, (error, totalComments) => {
      if (error) {
        console.error('댓글 수 조회 실패:', error.message);
        return res.status(500).send('댓글 수 조회 중 오류가 발생했습니다.');
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
  }catch(error){
    console.error('getCommentsCountByNickname Controller error :', error.message);
    res.status(500).send('getCommentsCountByNickname Controller error');
    }
};

const searchCommentsByContent = (req, res) => {
  try{
    const content = req.params.content;
  const page = parseInt(req.params.page) || 1;
  const limit = 10;  // 한 페이지당 10개의 결과를 보여줌
  const offset = (page - 1) * limit;

  postmanageService.searchCommentsByContent(content, limit, offset, (error, results) => {
    if (error) {
      console.error('댓글 내용 검색 실패:', error.message);
      return res.status(500).send('댓글 내용 검색 중 오류가 발생했습니다.');
    }

    // 전체 댓글 수를 조회하여 페이지네이션 정보를 추가
    postmanageService.getCommentsCountByContent(content, (error, totalComments) => {
      if (error) {
        console.error('댓글 수 조회 실패:', error.message);
        return res.status(500).send('댓글 수 조회 중 오류가 발생했습니다.');
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
  }catch(error){
    console.error('getCommentsCountByContent Controller error :', error.message);
    res.status(500).send('getCommentsCountByContent Controller error');
    }
};

const searchFraudCommentsByNickname = (req, res) => {
  try{
    const mem_id = req.params.mem_id;
  const page = parseInt(req.params.page) || 1;
  const limit = 10;  // 한 페이지당 10개의 결과를 보여줌
  const offset = (page - 1) * limit;

  postmanageService.searchFraudCommentsByNickname(mem_id, limit, offset, (error, results) => {
    if (error) {
      console.error('사기 피해 댓글 검색 실패:', error.message);
      return res.status(500).send('사기 피해 댓글 검색 중 오류가 발생했습니다.');
    }

    // 전체 댓글 수를 조회하여 페이지네이션 정보를 추가
    postmanageService.getFraudCommentsCountByNickname(mem_id, (error, totalComments) => {
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
  }catch(error){
    console.error('getFraudCommentsCountByNickname Controller error :', error.message);
    res.status(500).send('getFraudCommentsCountByNickname Controller error');
    }
};

const searchFraudCommentsByContent = (req, res) => {
  try{
    const content = req.params.content;
  const page = parseInt(req.params.page) || 1;
  const limit = 10;  // 한 페이지당 10개의 결과를 보여줌
  const offset = (page - 1) * limit;

  postmanageService.searchFraudCommentsByContent(content, limit, offset, (error, results) => {
    if (error) {
      console.error('사기 피해 댓글 검색 실패:', error.message);
      return res.status(500).send('사기 피해 댓글 검색 중 오류가 발생했습니다.');
    }

    // 전체 댓글 수를 조회하여 페이지네이션 정보를 추가
    postmanageService.getFraudCommentsCountByContent(content, (error, totalComments) => {
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
  }catch(error){
    console.error('getFraudCommentsCountByContent Controller error :', error.message);
    res.status(500).send('getFraudCommentsCountByContent Controller error');
    }
};


  module.exports = {
    addNoticeImage,
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
    searchCommentsByNickname,
    searchCommentsByContent,
    searchFraudCommentsByNickname,
    searchFraudCommentsByContent,
    returnUserInfo,
  };
  