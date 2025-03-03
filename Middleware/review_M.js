const db_pool = require("../database");

async function getUsers(req, res) {
    const month = req.body.month;
    const year = req.body.year;
    try {
        const promisePool = db_pool.promise();
        const sqlQuery = `
            SELECT DISTINCT
                users.id,
                users.full_name
            FROM users
                     JOIN
                 b_m ON users.id = b_m.user_id
            WHERE
                YEAR(b_m.date) = ? AND MONTH(b_m.date) = ?;
        `;
        const [rows] = await promisePool.query(sqlQuery, [year, month]);
        return res.json({ users: rows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getAvg(req, res) {
    const month = req.body.month;
    const year = req.body.year;

    try {
        const promisePool = db_pool.promise();
        const sqlQuery = `
            SELECT user_id AS userId,
                   AVG(high) AS avgHigh,
                   AVG(low) AS avgLow,
                   AVG(pulse) AS avgPulse
            FROM b_m
            WHERE YEAR(date) = ? AND MONTH(date) = ?
            GROUP BY user_id;
        `;
        const [rows] = await promisePool.query(sqlQuery, [year, month]);
        return res.json(rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getcount(req, res) {
    const month = req.body.month;
    const year = req.body.year;

    try {
        const promisePool = db_pool.promise();

        let sqlQuery = `
            SELECT
                user_id,
                AVG(low) AS avg_low,
                AVG(high) AS avg_high,
                AVG(pulse) AS avg_pulse
            FROM
                b_m
            WHERE
                YEAR(date) = ? AND MONTH(date) = ?
            GROUP BY
                user_id
        `;

        const [avgResults] = await promisePool.query(sqlQuery, [year, month]);
        console.log(avgResults)
        if (avgResults.length === 0) {
            return res.json([]);
        }

        const results = [];

        for (const avgResult of avgResults) {
            sqlQuery = `
                SELECT
                    COUNT(*) AS exceptions
                FROM
                    b_m
                WHERE
                    user_id = ? AND YEAR(date) = ? AND MONTH(date) = ?
                  AND (
                    low <= ? * 0.8 OR low >= ? * 1.2 OR
                    high <= ? * 0.8 OR high >= ? * 1.2 OR
                    pulse <= ? * 0.8 OR pulse >= ? * 1.2
                    )
            `;

            const [countResults] = await promisePool.query(sqlQuery, [
                avgResult.user_id, year, month,
                avgResult.avg_low, avgResult.avg_low,
                avgResult.avg_high, avgResult.avg_high,
                avgResult.avg_pulse, avgResult.avg_pulse
            ]);

            if (countResults[0].exceptions > 0) {
                results.push({
                    userId: avgResult.user_id,
                    exceptions: countResults[0].exceptions
                });
            }
        }

        return res.json(results);
    } catch (err) {
        console.error(err);
        return res.status(500).json([]);
    }
}


async function getYears(req, res) {
    try {
        const promisePool = db_pool.promise();
        const sqlQuery = 'SELECT DISTINCT YEAR(date) AS year FROM b_m';
        const [rows] = await promisePool.query(sqlQuery);

        const years = [];
        rows.forEach(row => {
            years.push(row.year);
        });


        res.json({ years });
        res.response = true;
    }catch (error) {
        console.error(error);
        res.response = false;
        res.status(500).send('שגיאה בהבאת השנים');
    }
}

async function getMonths(req, res) {
    const year = req.body.year;

    try {
        const promisePool = db_pool.promise();
        const sqlQuery = 'SELECT DISTINCT MONTH(date) AS month FROM b_m WHERE YEAR(date) = ?';
        const [rows] = await promisePool.query(sqlQuery, [year]);

        const months = [];
        rows.forEach(row => {
            months.push(row.month);
        });

        res.json({ months });
        res.response = true;
    } catch (error) {
        console.error(error);
        res.response = false;
        res.status(500).send('שגיאה בהבאת החודשים');
    }
}



module.exports = {
    getUsers,
    getAvg,
    getcount,
    getYears,
    getMonths
};
