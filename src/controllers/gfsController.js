const gfsService = require('../services/gfsService');

const getGfsList = (req, res) => {
    const de_idx = req.params.de_idx;
    const brand_name = req.params.brand_name;

    gfsService.getGfsList(de_idx, brand_name, (error, results) => {
        if (error) {
            console.error('GFS 리스트 불러오기 실패:', error.message);
            return res.status(500).send('GFS 리스트를 불러오는 중 오류가 발생했습니다.');
        }
        res.json(results);
    });
};

const getDepartmentList = (req, res) => {
    gfsService.getDepartmentList((error, results) => {
        if (error) {
            console.error('HM_DEPARTMENT 리스트 불러오기 실패:', error.message);
            return res.status(500).send('HM_DEPARTMENT 리스트를 불러오는 중 오류가 발생했습니다.');
        }
        res.json(results);
    });
};

const searchGfs = async (req, res) => {
    const { de_idx, brand_name, de_name, snu, dcolor } = req.query;  // query parameters에서 가져옴

    try {
        const results = await gfsService.searchGfs({ de_idx, brand_name, de_name, snu, dcolor });
        res.status(200).json(results);
    } catch (error) {
        console.error('GFS 검색 중 오류 발생:', error);
        res.status(500).json({ message: 'GFS 검색 중 오류가 발생했습니다.' });
    }
};

module.exports = {
    getGfsList,
    getDepartmentList,
    searchGfs,
};
