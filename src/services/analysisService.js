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

        const data = results.map((row, index) => {
          let date = new Date(row.period);
          if (index === 0) {
            row.total_visitors = (row.total_visitors || 0) + todayVisitors; // null을 0으로 대체하여 합산
          } else {
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
        COALESCE((
          SELECT SUM(vcnt)
          FROM hdumduStat.STAT_DATE_VISIT
          WHERE dt >= DATE_SUB(CURDATE(), INTERVAL (7 * seq + 6) DAY)
          AND dt <= DATE_SUB(CURDATE(), INTERVAL (7 * seq) DAY)
        ), 0) AS total_visitors
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
        COALESCE((
          SELECT SUM(vcnt)
          FROM hdumduStat.STAT_DATE_VISIT
          WHERE DATE_FORMAT(dt, '%Y-%m') = DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL seq MONTH), '%Y-%m')
        ), 0) AS total_visitors
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

    // 오늘의 방문자 수 쿼리 실행
    connection.query(todayVisitorsQuery, (error, todayResults) => {
      if (error) return callback(error);

      const todayVisitors = Number(todayResults[0].daily_visitors);

      // 첫 번째 인덱스에 오늘 방문자 수를 더해서 반환
      const data = results.map((row, index) => {
        const date = new Date(row.period);
        if (index === 0) {
          row.total_visitors = (row.total_visitors || 0) + todayVisitors; // null을 0으로 대체하여 합산
        }
        const formattedDate = date.toISOString().split('T')[0];
        return { [formattedDate]: row.total_visitors };
      });

      const response = { data };

      callback(null, response);
    });
  });
};







const getRegistrations = (type, callback) => {
  let query = '';

  if (type === 'date') {
    query = `
      SELECT 
        date_series.date AS period, 
        IFNULL(COUNT(hm.regdt), 0) AS registrations
      FROM 
        (
          SELECT DATE(DATE_SUB(CURDATE(), INTERVAL seq DAY)) AS date
          FROM (
            SELECT 0 AS seq UNION ALL 
            SELECT 1 UNION ALL 
            SELECT 2 UNION ALL 
            SELECT 3 UNION ALL 
            SELECT 4 UNION ALL 
            SELECT 5 UNION ALL 
            SELECT 6
          ) AS seq_table
        ) AS date_series
      LEFT JOIN hdumdu.HM_MEMBER hm ON DATE(hm.regdt) = date_series.date
      GROUP BY date_series.date
      ORDER BY date_series.date DESC;
    `;
  } else if (type === 'week') {
    query = `
      SELECT 
        DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL seq WEEK), '%Y-%m-%d') AS period,
        IFNULL(COUNT(hm.regdt), 0) AS registrations
      FROM 
        (
          SELECT 0 AS seq UNION ALL 
          SELECT 1 UNION ALL 
          SELECT 2 UNION ALL 
          SELECT 3 UNION ALL 
          SELECT 4
        ) AS seq_table
      LEFT JOIN hdumdu.HM_MEMBER hm ON YEARWEEK(hm.regdt, 1) = YEARWEEK(DATE_SUB(CURDATE(), INTERVAL seq WEEK), 1)
      GROUP BY period
      ORDER BY period DESC;
    `;
  } else if (type === 'month') {
    query = `
      SELECT 
        DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL seq MONTH), '%Y-%m') AS period,
        IFNULL(COUNT(hm.regdt), 0) AS registrations
      FROM 
        (
          SELECT 0 AS seq UNION ALL 
          SELECT 1 UNION ALL 
          SELECT 2 UNION ALL 
          SELECT 3 UNION ALL 
          SELECT 4
        ) AS seq_table
      LEFT JOIN hdumdu.HM_MEMBER hm ON DATE_FORMAT(hm.regdt, '%Y-%m') = DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL seq MONTH), '%Y-%m')
      GROUP BY period
      ORDER BY period DESC;
    `;
  } else {
    return callback(new Error('유효하지 않은 타입입니다.'));
  }

  connection.query(query, (error, results) => {
    if (error) return callback(error);

    const data = results.map(row => {
      const formattedDate = new Date(row.period);
      if (type === 'date') {
        formattedDate.setDate(formattedDate.getDate() + 1);
      }
      return { [formattedDate.toISOString().split('T')[0]]: row.registrations };
    });

    const response = { data };

    callback(null, response);
  });
};





const getTotalMembers = (type, callback) => {
  const todayMembersQuery = `
    SELECT COUNT(*) AS total_members
    FROM HM_MEMBER
    WHERE deldt IS NULL;
  `;

  let query = '';

  if (type === 'date') {
    query = `
      SELECT 
        dt AS period,
        mcnt AS total_members
      FROM hdumduStat.STAT_DATE_MEMBER
      WHERE dt <= CURDATE()
      ORDER BY dt DESC
      LIMIT 6;
    `;
  } else if (type === 'week') {
    query = `
      SELECT 
        DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL (7 * seq) DAY), '%Y-%m-%d') AS period,
        COALESCE((
          SELECT mcnt 
          FROM hdumduStat.STAT_DATE_MEMBER 
          WHERE dt = DATE_SUB(CURDATE(), INTERVAL (7 * seq) DAY)
          LIMIT 1
        ), 0) AS total_members
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
        COALESCE((
          SELECT mcnt 
          FROM hdumduStat.STAT_DATE_MEMBER 
          WHERE dt = DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL seq MONTH), '%Y-%m-01')
          LIMIT 1
        ), 0) AS total_members
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

    connection.query(todayMembersQuery, (error, todayResults) => {
      if (error) return callback(error);

      const todayMembers = Number(todayResults[0].total_members);

      // 첫 번째 인덱스에 오늘 방문자 수를 합산
      if (results.length > 0 && results[0].period === new Date().toISOString().split('T')[0]) {
        results[0].total_members += todayMembers;
      } else {
        const today = new Date().toISOString().split('T')[0];
        results.unshift({ period: today, total_members: todayMembers });
      }

      const data = results.map(row => {
        const formattedDate = new Date(row.period).toISOString().split('T')[0];
        return { [formattedDate]: row.total_members };
      });

      const response = { data };

      callback(null, response);
    });
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
    GROUP BY age_group, mem_sex
    ORDER BY age_group, mem_sex;
  `;

  connection.query(query, (error, results) => {
    if (error) return callback(error);

    // 데이터를 연령대별로 묶어서 새로운 형식으로 변환
    const groupedData = results.reduce((acc, row) => {
      const { age_group, mem_sex, count } = row;
      
      if (!acc[age_group]) {
        acc[age_group] = { age_group, male: 0, female: 0 };
      }

      if (mem_sex === 'Y') {
        acc[age_group].male = count;
      } else if (mem_sex === 'N') {
        acc[age_group].female = count;
      }

      return acc;
    }, {});

    // 객체 형태를 배열로 변환
    const data = Object.values(groupedData);

    callback(null, data);
  });
};


module.exports = {
  getVisitors,
  getRegistrations,
  getTotalMembers,
  getGenderAndAgeStats,  
};
