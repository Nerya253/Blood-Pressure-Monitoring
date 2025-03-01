const db_pool = require("../database");

async function getHistory(req, res) {
    const userId = req.body.userId;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    try {
        const promisePool = db_pool.promise();
        const sqlQuery = `
            SELECT date, high, low, pulse
            FROM b_m
            WHERE user_id = ? AND date BETWEEN ? AND ?
            ORDER BY date DESC
        `;

        const [rows] = await promisePool.query(sqlQuery, [userId, startDate, endDate]);
        console.log(rows);
        return res.json({ medidot: rows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    getHistory
};