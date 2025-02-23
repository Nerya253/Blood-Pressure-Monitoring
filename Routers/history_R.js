const express = require('express');
const historyRouter = express.Router();

module.exports = historyRouter;
const history_M = require("../Middleware/history_M")

historyRouter.post("/getMonthlySummary", history_M.getMonthlySummary, (req, res) => {
    if (req.success) {
        res.status(200).json({success: req.success})
    } else {
        res.status(500).send({success: req.success})
    }
})