const express = require('express');
const reviewRouter = express.Router();
const review_M = require("../Middleware/review_M");

reviewRouter.post("/getUsers", review_M.getUsers);
reviewRouter.post("/getAvg", review_M.getAvg);
reviewRouter.post("/getcount", review_M.getcount);
reviewRouter.get("/getYears", review_M.getYears);
reviewRouter.post("/getMonths", review_M.getMonths);

module.exports = reviewRouter;
