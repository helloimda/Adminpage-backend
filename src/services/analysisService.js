// services/analysisService.js
const connection = require('../config/db');

const getDailyVisitors = (callback) => {
  const query = `
    SELECT COUNT(*) AS daily_visitors
    FROM HM_MEMBER
    WHERE DATE(todaydt) = CURDATE();
  `;

  connection.query(query, (error, results) => {
    if (error) return callback(error);
    callback(null, results[0].daily_visitors);
  });
};

const getTodayRegistrations = (callback) => {
  const query = `
    SELECT COUNT(*) AS today_registrations
    FROM HM_MEMBER
    WHERE DATE(regdt) = CURDATE();
  `;

  connection.query(query, (error, results) => {
    if (error) return callback(error);
    callback(null, results[0].today_registrations);
  });
};

const getTotalMembers = (type, callback) => {
  let query = '';

  if (type === 'date') {
    query = `
      SELECT 
        DATE_SUB(CURDATE(), INTERVAL seq DAY) AS period,
        (
          SELECT COUNT(*) 
          FROM HM_MEMBER 
          WHERE deldt IS NULL AND DATE(regdt) <= DATE_SUB(CURDATE(), INTERVAL seq DAY)
        ) AS total_members
      FROM 
      (
        SELECT 0 AS seq UNION ALL 
        SELECT 1 UNION ALL 
        SELECT 2 UNION ALL 
        SELECT 3 UNION ALL 
        SELECT 4 UNION ALL 
        SELECT 5 UNION ALL 
        SELECT 6
      ) AS days
      ORDER BY period DESC;
    `;
  } else if (type === 'week') {
    query = `
      SELECT 
        STR_TO_DATE(CONCAT(YEARWEEK(CURDATE(), 1) - seq, ' Monday'), '%X%V %W') AS period,
        (
          SELECT COUNT(*) 
          FROM HM_MEMBER 
          WHERE deldt IS NULL AND YEARWEEK(regdt, 1) <= YEARWEEK(CURDATE(), 1) - seq
        ) AS total_members
      FROM 
      (
        SELECT 0 AS seq UNION ALL 
        SELECT 1 UNION ALL 
        SELECT 2 UNION ALL 
        SELECT 3 UNION ALL 
        SELECT 4
      ) AS weeks
      ORDER BY period DESC;
    `;
  } else if (type === 'month') {
    query = `
      SELECT 
        DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL seq MONTH), '%Y-%m') AS period,
        (
          SELECT COUNT(*) 
          FROM HM_MEMBER 
          WHERE deldt IS NULL AND DATE_FORMAT(regdt, '%Y-%m') <= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL seq MONTH), '%Y-%m')
        ) AS total_members
      FROM 
      (
        SELECT 0 AS seq UNION ALL 
        SELECT 1 UNION ALL 
        SELECT 2 UNION ALL 
        SELECT 3 UNION ALL 
        SELECT 4
      ) AS months
      ORDER BY period DESC;
    `;
  } else {
    return callback(new Error('유효하지 않은 타입입니다.'));
  }

  connection.query(query, (error, results) => {
    if (error) return callback(error);

    const data = results.map(row => {
      const formattedDate = new Date(row.period).toISOString().split('T')[0];
      return { [formattedDate]: row.total_members };
    });

    const response = { data };

    callback(null, response);
  });
};

const getGenderAndAgeStats = (callback) => {
  const query = `
    SELECT
      COALESCE(mem_sex, 'Unknown') AS mem_sex,  -- mem_sex가 NULL일 경우 'Unknown'으로 대체
      CASE
        WHEN TIMESTAMPDIFF(YEAR, mem_birth, CURDATE()) BETWEEN 10 AND 19 THEN '10대'
        WHEN TIMESTAMPDIFF(YEAR, mem_birth, CURDATE()) BETWEEN 20 AND 29 THEN '20대'
        WHEN TIMESTAMPDIFF(YEAR, mem_birth, CURDATE()) BETWEEN 30 AND 39 THEN '30대'
        WHEN TIMESTAMPDIFF(YEAR, mem_birth, CURDATE()) BETWEEN 40 AND 49 THEN '40대'
        WHEN TIMESTAMPDIFF(YEAR, mem_birth, CURDATE()) BETWEEN 50 AND 59 THEN '50대'
        WHEN TIMESTAMPDIFF(YEAR, mem_birth, CURDATE()) BETWEEN 60 AND 69 THEN '60대'
        ELSE '70대 이상'
      END AS age_group,
      COUNT(*) AS count
    FROM HM_MEMBER
    WHERE deldt IS NULL AND mem_sex IS NOT NULL  -- 성별 데이터가 있는 경우만 집계
    GROUP BY mem_sex, age_group
    ORDER BY mem_sex, age_group;
  `;

  connection.query(query, (error, results) => {
    if (error) return callback(error);
    callback(null, results);
  });
};


module.exports = {
  getDailyVisitors,
  getTodayRegistrations,
  getTotalMembers,
  getGenderAndAgeStats,  
};
