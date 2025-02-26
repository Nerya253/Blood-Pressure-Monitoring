const db_pool = require("../database");

async function createMadadim(req, res, next) {
    const user_id = req.body.user;
    const date = req.body.date;
    const high = req.body.high;
    const low = req.body.low;
    const pulse = req.body.pulse;

    console.log(user_id,date,high,low,pulse);

    try {
        const promisePool = db_pool.promise();
        const sqlQuery = `INSERT INTO b_m (user_id, date, high, low, pulse)
                          VALUES (?, ?, ?, ?, ?)`;
        const [result] = await promisePool.query(sqlQuery, [user_id, date, high, low, pulse]);

        req.insertId = result.insertId;
        req.success = true;
    } catch (error) {
        console.error("Error in createUser:", error);
        req.success = false;
    }
    next();
}

async function getMadadim(req, res, next) {
    const sqlQuery = `SELECT *
                      FROM b_m`;
    let rows = [];

    try {
        const promisePool = db_pool.promise();
        [rows] = await promisePool.query(sqlQuery);
        req.success = true;
        req.madadim = rows;
    } catch (err) {
        req.success = false;
        console.log(err);
    }

    next()
}

async function updateMadadim(req, res, next) {
    let madad_id = req.body.id;
    const date = req.body.date;
    const high = req.body.high;
    const low = req.body.low;
    const pulse = req.body.pulse;

    let sqlQuery = `UPDATE b_m `
    sqlQuery += `SET high = '${high}', `
    sqlQuery += ` low = '${low}', `
    sqlQuery += `pulse = '${pulse}', `
    sqlQuery += `date = '${date}' `
    sqlQuery += `WHERE id = ${madad_id}`;

    let rows = [];
    try {
        const promisePool = db_pool.promise();
        [rows] = await promisePool.query(sqlQuery);
        req.success = true;
    } catch (err) {
        req.success = false;
        console.log(err);
    }
    next()
}

async function deleteMadadim(req, res, next) {
    let madad_id = req.body.id;
    let rows = [];

    try {
        const promisePool = db_pool.promise();
        const sqlQuery = `DELETE FROM b_m WHERE id = ?`;
        [rows] = await promisePool.query(sqlQuery, [madad_id]);

        req.success = true;
    } catch (err) {
        req.success = false;
        console.log(err);
    }

    next();
}


module.exports = {
    createMadadim,
    getMadadim,
    updateMadadim,
    deleteMadadim
}