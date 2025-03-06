const db_pool = require("../database");


function validateDate(dateStr) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(dateStr)) {
        return {valid: false, message: "Please enter a valid date format (YYYY-MM-DD)"};
    }

    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    if (`${year}-${month}-${day}` !== dateStr) {
        return {valid: false, message: "Invalid date entered"};
    }

    if (year < 2000) {
        return {valid: false, message: "Date cannot be earlier than year 2000"};
    }

    const dateFormatted = `${year}-${month}-${day}`;

    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = String(today.getMonth() + 1).padStart(2, '0');
    const todayDay = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${todayYear}-${todayMonth}-${todayDay}`;

    if (dateFormatted > todayFormatted) {
        return {valid: false, message: "Date cannot be in the future"};
    }

    return {valid: true};
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

        const promisePool = db_pool.promise();
        const userCheckQuery = "SELECT COUNT(*) as count FROM users WHERE id = ?";
        const [userExists] = await promisePool.query(userCheckQuery, [user_id]);

        if (userExists[0].count === 0) {
            throw new Error("User ID does not exist");
        }

        const dateValidation = validateDate(date);
        if (!dateValidation.valid) {
            throw new Error(dateValidation.message);
        }
        const isNumber = (value) => /^\d+$/.test(String(value));
        if (!isNumber(user_id) || !isNumber(high) || !isNumber(low) || !isNumber(pulse)) {
            throw new Error("All data must be numbers");
        }
        if (parseInt(low) < 40 || parseInt(low) > 120) {
            throw new Error("Diastolic value must be between 40 and 120");
        }
        if (parseInt(high)  < 80 || parseInt(high)  > 220) {
            throw new Error("Systolic value must be between 80 and 220");
        }
        if (parseInt(high) <= parseInt(low)) {
            throw new Error("Systolic value must be greater than diastolic value");
        }
        if (parseInt(pulse)  < 40 || parseInt(pulse) > 220) {
            throw new Error("Pulse must be between 40 and 220");
        }

        const sqlQuery = `INSERT INTO b_m (user_id, date, high, low, pulse)
                          VALUES (?, ?, ?, ?, ?)`;
        const [result] = await promisePool.query(sqlQuery, [user_id, date, high, low, pulse]);

        req.insertId = result.insertId;
        req.success = true;
    } catch (error) {
        console.error("Error in createMadadim:", error);
        req.success = false;
        req.error = error.message;
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
        console.error("Error fetching madadim:", err);
    }
    next();
}

async function updateMadadim(req, res, next) {
    const madad_id = req.body.id;
    const high = req.body.high;
    const low = req.body.low;
    const pulse = req.body.pulse;

    try {
        if (!madad_id || !high || !low || !pulse) {
            throw new Error("Missing required parameter");
        }

        const isNumber = (value) => /^\d+$/.test(String(value));
        if (!isNumber(madad_id) || !isNumber(high) || !isNumber(low) || !isNumber(pulse)) {
            throw new Error("All data must be numbers");
        }
        if (parseInt(low) < 40 || parseInt(low) > 120) {
            throw new Error("Diastolic value must be between 40 and 120");
            return;
        }
        if (parseInt(high) < 80 || parseInt(high)  > 220) {
            throw new Error("Systolic value must be between 80 and 220");
            return;
        }
        if (parseInt(high) <= parseInt(low)) {
            throw new Error("Systolic value must be greater than diastolic value");
            return;
        }
        if (parseInt(pulse) < 40 || parseInt(pulse) > 220) {
            alert("Pulse must be between 40 and 220");
            return;
        }


        const promisePool = db_pool.promise();
        const sqlQuery = `UPDATE b_m
                          SET high  = ?,
                              low   = ?,
                              pulse = ?
                          WHERE id = ?`;
        const [rows] = await promisePool.query(sqlQuery, [high, low, pulse, madad_id]);

        if (rows.affectedRows === 0) {
            throw new Error("ID not found");
        }

        req.success = true;
    } catch (err) {
        req.success = false;
        console.error("Error updating madadim:", err);
    }
    next();
}

async function deleteMadadim(req, res, next) {
    let madad_id = req.body.id;
    let rows = [];

    try {
        if (!madad_id) {
            throw new Error("Please fill in all details.");
        }
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
        if (rows.affectedRows === 0) {
            throw new Error("ID not found");
        }
        req.success = true;
    } catch (err) {
        req.success = false;
        console.error("Error deleting madadim:", err);
    }
    next();
}

module.exports = {
    createMadadim,
    getMadadim,
    updateMadadim,
    deleteMadadim
}