const db_pool = require("../database");

async function getMonthlySummary(req, res, next) {
    try {
        const promisePool = db_pool.promise();
        const sqlQuery = `
            SELECT u.full_name,
                   AVG(b.low)   AS low_saturation_avg,
                   AVG(b.high)  AS high_saturation_avg,
                   AVG(b.pulse) AS pulse_avg
            FROM users u
                     JOIN b_m b ON u.id = b.user_id
            GROUP BY u.id, u.full_name`;

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
