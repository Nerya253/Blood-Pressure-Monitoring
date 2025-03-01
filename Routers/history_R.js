const express = require('express');
const historyRouter = express.Router();

module.exports = historyRouter;
const history_M = require("../Middleware/history_M")


historyRouter.post("/getHistory", history_M.getHistory, (req, res) => {
    if (req.success) {
        res.status(200).json(req.data);
    } else {
        res.status(500).send({success: req.success})
    }
})
