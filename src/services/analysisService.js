// services/analysisService.js
const connection = require('../config/db');

const getVisitors = (type, callback) => {
  let query = '';

  if (type === 'date') {
    query = `
      SELECT 
        dt AS period,
        vcnt AS total_visitors
      FROM hdumduStat.STAT_DATE_VISIT
      WHERE dt <= CURDATE()
      ORDER BY dt DESC
      LIMIT 7;
    `;
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

    // 날짜에 1일을 추가하고, week/month의 경우 합산
    const data = results.map((row) => {
      const date = new Date(row.period);
      date.setDate(date.getDate() + 1);  // 날짜에 1일 추가
      const formattedDate = date.toISOString().split('T')[0];
      return { [formattedDate]: Number(row.total_visitors) }; // 숫자로 변환하여 반환
    });

    const response = { data };

    callback(null, response);
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


const getPostCounts = (type, callback) => {
  let query = '';

  if (type === 'date') {
    query = `
      SELECT 
        DATE(regdt) AS period,
        COUNT(*) AS total_posts
      FROM HM_BOARD
      WHERE regdt >= CURDATE() - INTERVAL 6 DAY
      GROUP BY DATE(regdt)
      ORDER BY DATE(regdt) DESC;
    `;
  } else if (type === 'week') {
    query = `
      SELECT 
        DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL (7 * seq) DAY), '%Y-%m-%d') AS period,
        (
          SELECT COUNT(*)
          FROM HM_BOARD
          WHERE regdt >= DATE_SUB(CURDATE(), INTERVAL (7 * seq + 6) DAY)
          AND regdt <= DATE_SUB(CURDATE(), INTERVAL (7 * seq) DAY)
        ) AS total_posts
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
          FROM HM_BOARD
          WHERE regdt >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL seq MONTH), '%Y-%m-01')
          AND regdt < DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL (seq - 1) MONTH), '%Y-%m-01')
        ) AS total_posts
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

    // 날짜 포맷 처리
    const data = results.map((row) => {
      const date = new Date(row.period);
      const formattedDate = date.toISOString().split('T')[0];
      return { [formattedDate]: Number(row.total_posts) };
    });

    const response = { data };

    callback(null, response);
  });
};

const getPostsByCategory = (date, callback) => {
  const query = `
      SELECT 
        b.ca_idx, 
        COALESCE(c.ca_subject, 'null') AS cd_tag, 
        COUNT(*) as count
      FROM 
        HM_BOARD b
      LEFT JOIN 
        HM_CATEGORY c 
      ON 
        b.ca_idx = c.ca_idx
      WHERE 
        DATE(b.regdt) = ?
      GROUP BY 
        b.ca_idx, c.ca_subject
      ORDER BY 
        b.ca_idx ASC, c.ca_subject ASC;
  `;

  connection.query(query, [date], (error, results) => {
      if (error) return callback(error);
      callback(null, results);
  });
};


const getAllPostsByCategory = (callback) => {
  const query = `
      SELECT 
        b.ca_idx, 
        COALESCE(c.ca_subject, 'null') AS cd_tag, 
        COUNT(*) as total_posts
      FROM 
        HM_BOARD b
      LEFT JOIN 
        HM_CATEGORY c 
      ON 
        b.ca_idx = c.ca_idx
      WHERE 
        b.deldt IS NULL
      GROUP BY 
        b.ca_idx, c.ca_subject
      ORDER BY 
        b.ca_idx ASC, c.ca_subject ASC;
  `;

  connection.query(query, (error, results) => {
      if (error) return callback(error);
      callback(null, results);
  });
};




module.exports = {
  getVisitors,
  getRegistrations,
  getTotalMembers,
  getGenderAndAgeStats,  
  getPostCounts,
  getPostsByCategory,
  getAllPostsByCategory,
};
