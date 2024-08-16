// services/analysisService.js
const connection = require('../config/db');

const getVisitors = (type, callback) => {
  let query = '';

  const todayVisitorsQuery = `
    SELECT COUNT(*) AS daily_visitors
    FROM HM_MEMBER
    WHERE DATE(todaydt) = CURDATE();
  `;

  if (type === 'date') {
    query = `
      SELECT 
        dt AS period,
        vcnt AS total_visitors
      FROM hdumduStat.STAT_DATE_VISIT
      WHERE dt <= CURDATE()
      ORDER BY dt DESC
      LIMIT 6;
    `;
    connection.query(query, (error, results) => {
      if (error) return callback(error);

      connection.query(todayVisitorsQuery, (error, todayResults) => {
        if (error) return callback(error);

        const todayVisitors = Number(todayResults[0].daily_visitors);

        const today = new Date().toISOString().split('T')[0];
        results.unshift({ period: today, total_visitors: todayVisitors });

        const data = results.map((row, index) => {
          let date = new Date(row.period);
          if (index > 0) {
            date.setDate(date.getDate() + 1);
          }
          const formattedDate = date.toISOString().split('T')[0];
          return { [formattedDate]: row.total_visitors };
        });

        const response = { data };
        return callback(null, response);
      });
    });
    return;
  } else if (type === 'week') {
    query = `
      SELECT 
        DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL (7 * seq) DAY), '%Y-%m-%d') AS period,
        (
          SELECT IFNULL(SUM(vcnt), 0)
          FROM hdumduStat.STAT_DATE_VISIT
          WHERE dt >= DATE_SUB(CURDATE(), INTERVAL (7 * seq + 6) DAY)
          AND dt <= DATE_SUB(CURDATE(), INTERVAL (7 * seq) DAY)
        ) AS total_visitors
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
        COALESCE(SUM(v.vcnt), 0) AS total_visitors
      FROM 
      (
        SELECT 0 AS seq UNION ALL
        SELECT 1 UNION ALL
        SELECT 2 UNION ALL
        SELECT 3 UNION ALL
        SELECT 4
      ) AS months
      LEFT JOIN hdumduStat.STAT_DATE_VISIT v
      ON v.dt >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL seq MONTH), '%Y-%m-01')
      AND v.dt < DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL (seq - 1) MONTH), '%Y-%m-01')
      GROUP BY period
      ORDER BY period DESC;
    `;
  } else {
    return callback(new Error('유효하지 않은 타입입니다.'));
  }

  connection.query(query, (error, results) => {
    if (error) return callback(error);

    // 두 번째 쿼리 실행 (오늘 날짜의 방문자 수)
    connection.query(todayVisitorsQuery, (error, todayResults) => {
      if (error) return callback(error);

      const todayVisitors = todayResults[0].daily_visitors;

      // 날짜에 1일을 추가하고, week/month의 경우 합산
      const data = results.map((row, index) => {
        const date = new Date(row.period);

        // 첫 번째 인덱스에 오늘 방문자 수를 합산 (숫자 덧셈 보장)
        if (index === 0) {
          row.total_visitors = Number(row.total_visitors) + Number(todayVisitors);
        }

        const formattedDate = date.toISOString().split('T')[0];
        return { [formattedDate]: Number(row.total_visitors) }; // 숫자로 변환하여 반환
      });

      const response = { data };

      callback(null, response);
    });
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
  getVisitors,
  getTodayRegistrations,
  getTotalMembers,
  getGenderAndAgeStats,  
};
