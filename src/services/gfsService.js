const connection = require('../config/db');

const getGfsList = (de_idx, brand_name, callback) => {
   

    console.log('gfslist  de_idx:', de_idx, 'brand_name:', brand_name);

    const query = `
        SELECT DISTINCT
            cr.cg_idx, 
            cr.brand_idx, 
            brand2.brand_rname AS brand_name,
            cr.btype, 
            cr.link, 
            cr.name, 
            cr.snu, 
            cr.kind, 
            cr.bezel1, 
            cr.bezel2, 
            cr.bracelet1, 
            cr.bracelet2, 
            cr.dcolor1, 
            cr.dcolor2, 
            cr.price, 
            cr.imgs, 
            cr.base_image,
            CASE 
                WHEN cr.base_image IS NOT NULL THEN REPLACE(cr.base_image, cr.base_name, CONCAT('thumb/', cr.base_name)) 
                ELSE NULL 
            END AS thumb_image,
            cr.size, 
            cr.size2, 
            cr.material1,
            cr.material2,
            cr.price_jpn, 
            cr.price_usa, 
            cr.price_ch, 
            cr.price_cn,
            cr.buy_level,
            cr.tags,
            CASE 
                WHEN crs.cgs_idx IS NULL OR crs.cnt = 0 THEN 'N' 
                ELSE 'Y' 
            END AS isstock,
            IFNULL(crs.cnt, 0) AS stock,
            IFNULL(crs.dt, '') AS stock_dt,
            crs.isAnonymous,
            cr.cnt_view,
            cr.cnt_star,
            cr.avg_star,
            cr.cnt_good,
            cr.cnt_bad,
            cr.cnt_alarm,
            cr.cnt_bookmark,
            cr.cnt_comment,
            crs.mem_idx,
            mem.mem_profile_url,
            mem.mem_nick,
            'N' AS isbookmark,
            'N' AS isstar,
            NULL AS mystar,
            NULL AS mystardt,
            'N' AS isgood,
            NULL AS mygooddt,
            'N' AS isbad,
            NULL AS mybaddt,
            imgS.file_name AS file_nameS,
            imgS.file_url AS file_urlS,
            dep.de_idx,
            cr.regdt
        FROM 
            CR_GOODS_STOCK crs
        LEFT OUTER JOIN CR_GOODS cr ON cr.isdel = 'N' AND cr.cg_idx = crs.cg_idx
        LEFT OUTER JOIN HM_DEPARTMENT_BRAND deb ON cr.brand_idx = deb.brand_idx
        LEFT OUTER JOIN HM_DEPARTMENT dep ON dep.de_idx = crs.de_idx
        LEFT OUTER JOIN HM_BRAND brand2 ON brand2.brand_idx = cr.brand_idx
        LEFT OUTER JOIN HM_MEMBER mem ON crs.mem_idx = mem.mem_idx
        LEFT OUTER JOIN (
            SELECT 
                cgs_idx, 
                GROUP_CONCAT(file_name) AS file_name, 
                GROUP_CONCAT(file_url) AS file_url 
            FROM 
                CR_GOODS_STOCK_IMG img 
            WHERE 
                img.isdel = 'N'
            GROUP BY 
                cgs_idx
        ) imgS ON imgS.cgs_idx = crs.cgs_idx
        WHERE 
            crs.isdel = 'N'
            AND dep.de_idx = ?
            AND brand2.brand_rname = ?
            AND DATE_ADD(DATE_ADD(CONCAT(crs.dt, SUBSTR(NOW(), 11, 10)), INTERVAL -10 HOUR), INTERVAL 1 DAY) > NOW()
        ORDER BY 
            dep.de_idx ASC, 
            CASE 
                WHEN crs.cgs_idx IS NULL OR crs.cnt = 0 THEN 0 
                ELSE 1 
            END DESC,
            cr.buy_level DESC, 
            cr.cg_idx DESC, 
            brand2.onum;
    `;

    connection.query(query, [de_idx, brand_name], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
};


const getDepartmentList = (callback) => {
    const query = `
        SELECT 
            de_idx, 
            de_name, 
            isdepart, 
            de_sname, 
            de_cate, 
            de_cate_onum, 
            de_onum, 
            abbreviation, 
            de_url, 
            de_img, 
            cnt_sale, 
            cnt_view, 
            de_rating, 
            addr, 
            tel, 
            bhour, 
            content, 
            parking, 
            lat, 
            lng, 
            etc, 
            back_mobile_low_old, 
            back_mobile_low, 
            back_pc_low, 
            back_mobile_high, 
            back_pc_high, 
            regdt
        FROM HM_DEPARTMENT
    `;

    connection.query(query, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
};
module.exports = {
    getGfsList,
    getDepartmentList,
};
