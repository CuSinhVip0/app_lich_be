const express = require("express");
const app = express();

const connection = require("../services/index");

app.post("/insertInforToDatabase", (req, res) => {
    const { Id_Platform, Platform, Name, UrlPic, Email } = req.body;
    connection.query(
        `
            Call updateInforToDatabase (?,?,?,?,?)
        `,
        [Id_Platform, Platform, Name, UrlPic, Email],
        (err, rows, fields) => {
            if (err) {
                console.log(err);
                res.status(500).send({ status: "error" });
            }
            const newId = rows.insertId;
            if (rows.affectedRows != 0) {
                try {
                    connection.query(
                        `
                            Insert into user_settings (Id_User)
                            Values (?)
                        `,
                        [Id_Platform],
                        (err, rows, fields) => {
                            if (err) {
                                res.status(500).send({ status: "error" });
                            }
                            res.status(200).send({ status: "oke", newId: newId });
                        }
                    );
                } catch (err) {
                    res.status(500).send({ status: "error" });
                }
            } else {
                res.status(500).send({ status: "oke" });
            }
        }
    );
});

app.post("/updateInforToDatabase/:key", (req, res) => {
    const Key = req.params.key;
    console.log("🚀 ~ app.post ~ Key:", Key);
    const { Id_User, Value } = req.body;
    try {
        connection.query(
            `
                Update user_infor
                Set ${Key} = ?
                Where Id_User = ?
            `,
            [Value, Id_User],
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows.affectedRows == 0) {
                    return res.status(500).send({ status: "error" });
                }
                return res.status(200).send({ status: "oke" });
            }
        );
    } catch (error) {
        return res.status(500).send({ status: "error" });
    }
});

app.post("/updateInforToDatabase", (req, res) => {
    const { Id_User, Name, UrlPic, Birth, Gender, NguHanh, CungMenh } = req.body;
    try {
        connection.query(
            `
                Update user_infor A
                Set 
                A.UrlPic = ?,
                A.Birth = ?,
                A.Name = ?,
                A.Gender = ?,
                A.NguHanh = ?,
                A.CungMenh = ?
                Where A.Id_User = ?
            `,
            [UrlPic, Birth, Name, Gender, NguHanh, CungMenh, Id_User],
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows.affectedRows == 0) {
                    return res.status(500).send({ status: "error" });
                }
                return res.status(200).send({ status: "oke" });
            }
        );
    } catch (error) {
        return res.status(500).send({ status: "error" });
    }
});

app.post("/getInforFromDatabase", (req, res) => {
    const { Id_User } = req.body;
    try {
        connection.query(
            `
               Select A.Id, A.Id_User, A.Name, A.UrlPic, A.Email, A.Birth, A.Gender, A.Phone, A.Address, A.Job, A.NguHanh, A.CungMenh
               From user_infor A
               Where A.Id_User = ?
            `,
            [Id_User],
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ status: "error" });
                }
                console.log(rows);
                return res.status(200).send({ status: "oke", result: rows[0] });
            }
        );
    } catch (error) {
        return res.status(500).send({ status: "error" });
    }
});

//#region  setting

app.post("/updateSettingtoDataBase", (req, res) => {
    const { Type, Value, Id_Platform } = req.body;
    try {
        connection.query(
            `
                Update user_settings
                Set ${Type} = ?
                Where Id_User = ?
            `,
            [Value, Id_Platform],
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ status: "error" });
                }
                return res.status(200).send({ status: "oke" });
            }
        );
    } catch (err) {
        console.log(err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/getSettingFromDataBase", (req, res) => {
    const { Id_Platform } = req.body;
    try {
        connection.query(
            `
                Select A.Id, A.DarkMode, A.Language, A.StyleTime, A.Id_User
                From user_settings A
                Where A.Id_User = ?
            `,
            [Id_Platform],
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ status: "error" });
                }

                return res.status(200).send({
                    status: "oke",
                    result: {
                        ...rows[0],
                        DarkMode: rows.length > 0 && rows[0].DarkMode == 1 ? true : false,
                    },
                });
            }
        );
    } catch (err) {
        return res.status(500).send({ status: "error" });
    }
});

//#endregion

module.exports = app;
