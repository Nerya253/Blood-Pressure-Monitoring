const db_pool = require("../database");

async function createUser(req, res, next) {
    const newUserName = req.body.newUserName;
    try {
        if (!newUserName) {
            throw new Error("Please fill in all details.")
        }
        if (newUserName.trim() === '') {
            throw new Error("Data cannot be empty");
        }
        const isLettersOnly = (value) => /^[a-zA-Z\u0590-\u05FF]+$/.test(String(value));
        if (!isLettersOnly(newUserName)) {
            throw new Error("Username can only contain letters");
        }

        const promisePool = db_pool.promise();
        const sqlQuery= `INSERT INTO users (full_name)
                         VALUES (?)`;
        const [result] = await promisePool.query(sqlQuery, [newUserName]);
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
    const newName = req.body.newName;

    try {
        if (!id || !newName) {throw new Error("Please fill in all details.")}
        if (id.trim() === '' || newName.trim() === '') {
            throw new Error("Data cannot be empty");
        }
        const isNumber = (value) => /^\d+$/.test(String(value));
        if (!isNumber(id)) {
            throw new Error("ID can only contain numbers");
        }
        const isLettersOnly = (value) => /^[a-zA-Z\u0590-\u05FF]+$/.test(String(value));
        if (!isLettersOnly(newName)) {
            throw new Error("Username can only contain letters");
        }

        if (!newName || newName.trim().length === 0) {throw new Error("Please enter a name")}
        let sqlQuery = `UPDATE users `
        sqlQuery += `SET full_name = '${newName}' `
        sqlQuery += `WHERE id = ${id}`;
        const promisePool = db_pool.promise();
        let[rows] = await promisePool.query(sqlQuery);

        if (rows.affectedRows === 0){
            throw new Error("ID not found");
        }
        if (rows.affectedRows === 1 && rows.changedRows === 0){
            throw new Error("No change, data is equal to previous");
        }
        req.success = true;
    } catch (err) {
        req.success = false;
        console.log(err);
    }
    next()
}

async function deleteUser(req, res, next) {
    let id = req.body.id;

    try {
        if (!id) {
            throw new Error("Missing required parameter");
        }
        if (id.trim() === '') {
            throw new Error("Data cannot be empty");
        }
        const isNumber = (value) => /^\d+$/.test(String(value));
        if (!isNumber(id)) {
            throw new Error("ID can only contain numbers");
        }

        const promisePool = db_pool.promise();

        const sqlDeleteFromBM = `DELETE FROM b_m WHERE user_id = ?`;
        await promisePool.query(sqlDeleteFromBM, [id]);

        const sqlDeleteUser = `DELETE FROM users WHERE id = ?`;
        const [rows] = await promisePool.query(sqlDeleteUser, [id]);
        if (rows.affectedRows === 0){
            throw new Error("ID not found")
        }
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