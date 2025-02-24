const express = require('express');
const madadimRouter = express.Router();

module.exports = madadimRouter;
const madadim_M = require("../Middleware/madadim_M")

madadimRouter.post("/createMadadim", madadim_M.createMadadim, (req, res) => {//Create - הוספה
    if (req.success) {
        res.status(200).json({success: req.success, insertId: req.insertId})
    } else {
        res.status(500).send({success: req.success})
    }
})

madadimRouter.get("/getMadadim", madadim_M.getMadadim, (req, res) => {//Read - קבלת רשימה
    if (req.success) {
        res.status(200).send({success: req.success, madadim: req.madadim})
    } else {
        res.status(500).send({success: req.success})
    }
})

madadimRouter.put("/updateMadadim", madadim_M.updateMadadim, (req, res) => {//Update - עריכה
    if (req.success) {
        res.status(200).send({success: req.success})
    } else {
        res.status(500).send({success: req.success})
    }
})

madadimRouter.delete("/deleteMadadim", madadim_M.deleteMadadim, (req, res) => {// Delete - מחיקה
    if (req.success) {
        res.status(200).send({success: req.success})
    } else {
        res.status(500).send({success: req.success})
    }
})