const express = require('express');
const historyRouter = express.Router();

module.exports = historyRouter;
const db_pool = require("../database");

historyRouter.post('/getMonthlySummary', async (req, res) => {
    let rows = [];

    try {
        const promisePool = db_pool.promise();

        const sqlQuery = `
            SELECT 
                u.full_name, 
                AVG(b.low) AS low_saturation_avg, 
                AVG(b.high) AS high_saturation_avg, 
                AVG(b.pulse) AS pulse_avg
            FROM users u
            JOIN b_m b ON u.id = b.user_id
            GROUP BY u.id, u.full_name
        `;
        [rows] = await promisePool.query(sqlQuery);

        db_pool.query(sqlQuery, (err, results) => {
            if (err) {
                console.error('Error fetching user monthly summary:', err);
                return res.status(500).send('Error fetching data');
            }
            res.json(results);
        });
        req.avg = rows;
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('Internal server error');
    }
});
