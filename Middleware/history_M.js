const db_pool = require("../database");

async function getHistory(req, res) {
    const userId = req.body.userId;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    try {
        const promisePool = db_pool.promise();

        let sqlQuery = `
            SELECT id, date, high, low, pulse
            FROM b_m
            WHERE user_id = ? AND date BETWEEN ? AND ?
            ORDER BY date DESC
        `;

        const [rows] = await promisePool.query(sqlQuery, [userId, startDate, endDate]);

        if (rows.length === 0) {
            return res.json({ measurements: [], deviationIds: [] });
        }

        sqlQuery = `
            SELECT 
                AVG(high) AS avg_high,
                AVG(low) AS avg_low,
                AVG(pulse) AS avg_pulse
            FROM b_m
            WHERE user_id = ? AND date BETWEEN ? AND ?
        `;

        const [avgResult] = await promisePool.query(sqlQuery, [userId, startDate, endDate]);

        if (avgResult.length === 0) {
            return res.json({ measurements: rows, deviationIds: [] });
        }

        const avgHigh = avgResult[0].avg_high;
        const avgLow = avgResult[0].avg_low;
        const avgPulse = avgResult[0].avg_pulse;
        const deviationIds = [];

        for (const row of rows) {
            if (row.high < avgHigh * 0.8 || row.high > avgHigh * 1.2 ||
                row.low < avgLow * 0.8 || row.low > avgLow * 1.2 ||
                row.pulse < avgPulse * 0.8 || row.pulse > avgPulse * 1.2)
            {
                deviationIds.push(row.id);
            }
        }

        return res.json({
            measurements: rows,
            deviationIds: deviationIds
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    getHistory
};