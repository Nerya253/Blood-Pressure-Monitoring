const db_pool = require("../database");

async function createMadadim(req, res, next) {
    const user_id = req.body.user;
    const high = req.body.high;
    const low = req.body.low;
    const pulse = req.body.pulse;

    console.log(user_id,high,low,pulse);

    try {
        const promisePool = db_pool.promise();
        const sqlQuery = `INSERT INTO b_m (user_id, date, high, low, pulse)
                          VALUES (?, NOW(), ?, ?, ?)`;
        const [result] = await promisePool.query(sqlQuery, [user_id, high, low, pulse]);

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
                      FROM users`;
    let rows = [];

    try {
        const promisePool = db_pool.promise();
        [rows] = await promisePool.query(sqlQuery);
        req.success = true;
        req.users = rows;
    } catch (err) {
        req.success = false;
        console.log(err);
    }

    next()
}

async function updateMadadim(req, res, next) {
    let id = req.body.id;
    const newName = req.body.full_name;

    let sqlQuery = `UPDATE users `
    sqlQuery += `SET full_name = '${newName}' `
    sqlQuery += `WHERE id = ${id}`;
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
    let id = req.body.id;
    let rows = [];

    try {
        const promisePool = db_pool.promise();

        const sqlDeleteFromBM = `DELETE FROM b_m WHERE user_id = ?`;
        await promisePool.query(sqlDeleteFromBM, [id]);

        const sqlDeleteUser = `DELETE FROM users WHERE id = ?`;
        [rows] = await promisePool.query(sqlDeleteUser, [id]);

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