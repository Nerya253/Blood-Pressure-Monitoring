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
    console.log(month);
    console.log(year);
    try {
        const promisePool = db_pool.promise();
        const sqlQuery = `
            SELECT
                m.user_id AS userId,
                COUNT(*) AS exceptions
            FROM
                b_m AS m
                    JOIN (
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
                ) AS avg_values ON m.user_id = avg_values.user_id
            WHERE
                YEAR(m.date) = ? AND MONTH(m.date) = ?
              AND (
                m.low <= avg_values.avg_low * 0.8 OR m.low >= avg_values.avg_low * 1.2 OR
                m.high <= avg_values.avg_high * 0.8 OR m.high >= avg_values.avg_high * 1.2 OR
                m.pulse <= avg_values.avg_pulse * 0.8 OR m.pulse >= avg_values.avg_pulse * 1.2
                )
            GROUP BY
                m.user_id;
        `;
        const [rows] = await promisePool.query(sqlQuery, [year, month,year, month]);

        return res.json(rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
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
