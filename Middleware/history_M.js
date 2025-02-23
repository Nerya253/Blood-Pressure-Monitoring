const db_pool = require("../database");

async function getMonthlySummary(req, res, next) {
    try {
        const promisePool = db_pool.promise();
        const sqlQuery = `
            SELECT u.full_name,
                   user_avg.low_saturation_avg,
                   user_avg.high_saturation_avg,
                   user_avg.pulse_avg,
                   COUNT(CASE
                             WHEN b.low > user_avg.low_saturation_avg * 1.2
                                 OR b.low < user_avg.low_saturation_avg * 0.8
                                 OR b.high > user_avg.high_saturation_avg * 1.2
                                 OR b.high < user_avg.high_saturation_avg * 0.8
                                 OR b.pulse > user_avg.pulse_avg * 1.2
                                 OR b.pulse < user_avg.pulse_avg * 0.8
                                 THEN 1
                             ELSE NULL
                       END) AS abnormal_measurements_count
            FROM users u
                     JOIN b_m b ON u.id = b.user_id
                     JOIN (SELECT user_id,
                                  AVG(low)   AS low_saturation_avg,
                                  AVG(high)  AS high_saturation_avg,
                                  AVG(pulse) AS pulse_avg
                           FROM b_m
                           WHERE
                               YEAR (date) = YEAR (CURRENT_DATE)
                             AND MONTH (date) = MONTH (CURRENT_DATE)
                           GROUP BY
                               user_id) user_avg ON b.user_id = user_avg.user_id
            WHERE
                YEAR (b.date) = YEAR (CURRENT_DATE)
              AND MONTH (b.date) = MONTH (CURRENT_DATE)
            GROUP BY
                u.id, u.full_name, user_avg.low_saturation_avg, user_avg.high_saturation_avg, user_avg.pulse_avg;
        `;

        const [rows] = await promisePool.query(sqlQuery);

        res.json(rows);

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('Internal server error');
    }

}

module.exports = {
    getMonthlySummary
};
