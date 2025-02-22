const db_pool = require("../database");

async function createUser(req, res, next) {
    const full_name = req.body["new-user-name"];
    try {
        const promisePool = db_pool.promise();
        const sqlQuery= `INSERT INTO users (full_name)
                           VALUES (?)`;
        const [result] = await promisePool.query(sqlQuery, [full_name]);
        req.insertId = result.insertId;
        req.success = true;
    } catch (error) {
        console.error("Error in createUser:", error);
        req.success = false;
    }
    next();
}

async function getUsers(req, res, next) {
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

async function updateUser(req, res, next) {
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

async function deleteUser(req, res, next) {
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
    createUser,
    getUsers,
    updateUser,
    deleteUser
}