const db_pool = require("../database");


function validateDate(dateStr) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(dateStr)) {
        return false;
    }
    const date = new Date(dateStr);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}` === dateStr;
}



async function createMadadim(req, res, next) {
    const user_id = req.body.user;
    const date = req.body.date;
    const high = req.body.high;
    const low = req.body.low;
    const pulse = req.body.pulse;

    try {
        if (!user_id || !date || !high || !low || !pulse) {
            throw new Error("Missing required parameter");
        }
        if (!validateDate(date)) {
            throw new Error("Please enter a valid date in the format YYYY-MM-DD.");
        }
        const isNumber = (value) => /^\d+$/.test(String(value));
        if (!isNumber(user_id) || !isNumber(high) || !isNumber(low) || !isNumber(pulse)) {
            throw new Error("All data must be numbers");
        }

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
    const madad_id = req.body.id;
    const high = req.body.high;
    const low = req.body.low;
    const pulse = req.body.pulse;

    let rows = [];
    try {
        if (!madad_id || !high || !low || !pulse) {
            throw new Error("Missing required parameter");
        }

        const isNumber = (value) => /^\d+$/.test(String(value));
        if (!isNumber(madad_id) || !isNumber(high) || !isNumber(low) || !isNumber(pulse)) {
            throw new Error("All data must be numbers");
        }

        let sqlQuery = `UPDATE b_m `
        sqlQuery += `SET high = '${high}', `
        sqlQuery += ` low = '${low}', `
        sqlQuery += `pulse = '${pulse}' `
        sqlQuery += `WHERE id = ${madad_id}`;
        const promisePool = db_pool.promise();
        [rows] = await promisePool.query(sqlQuery);
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

async function deleteMadadim(req, res, next) {
    let madad_id = req.body.id;
    let rows = [];

    try {
        if (!madad_id) {throw new Error("Please fill in all details.")}
        if (madad_id < 1) {
            throw new Error("ID not found");
        }
        const isNumber = (value) => /^\d+$/.test(String(value));
        if (!isNumber(madad_id)) {
            throw new Error("ID can only contain numbers");
        }


        const promisePool = db_pool.promise();
        const sqlQuery = `DELETE
                          FROM b_m
                          WHERE id = ?`;
        [rows] = await promisePool.query(sqlQuery, [madad_id]);
        if (rows.affectedRows === 0){
            throw new Error("ID not found");
        }
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