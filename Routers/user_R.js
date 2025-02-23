const express = require('express');
const UserRouter = express.Router();

module.exports = UserRouter;
const user_M = require("../Middleware/user_M")


UserRouter.post("/createUser", user_M.createUser,user_M.getUsers, (req, res) => {//Create - הוספה
    if (req.success) {
        res.status(200).json({success: req.success, insertId: req.insertId, users: req.users});
    } else {
        res.status(500).send({success: req.success})
    }
})

UserRouter.get("/getUsers", user_M.getUsers, (req, res) => {//Read - קבלת רשימה
    if (req.success) {
        res.status(200).send({success: req.success, users: req.users})
    } else {
        res.status(500).send({success: req.success})
    }
})

UserRouter.put("/updateUser", user_M.updateUser, (req, res) => {//Update - עריכה
    if (req.success) {
        res.status(200).send({success: req.success})
    } else {
        res.status(500).send({success: req.success})
    }
})

UserRouter.delete("/deleteUser", user_M.deleteUser, (req, res) => {// Delete - מחיקה
    if (req.success) {
        res.status(200).send({success: req.success})
    } else {
        res.status(500).send({success: req.success})
    }
})