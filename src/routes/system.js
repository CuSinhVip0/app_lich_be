const express = require("express");
const app = express();
const connection = require("../services/index");

app.get("/getAllSu", (req, res) => {
    connection.query(`select * from su`, (err, rows, fields) => {
        if (err) res.status(500).send(err);
        res.status(200).send(rows);
    });
});

app.post("/updateSu", (req, res) => {
    const { thang, canchi, su } = req.body;
    try {
        connection.query(
            `INSERT INTO ngay_tot(Thang,Id_CanChi, Id_Su ) VALUES
        ?
        `,
            [su.map((x) => [thang, canchi, x])],
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ status: "error" });
                }
                return res.status(200).send({ status: "oke", data: rows });
            }
        );
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: "error" });
    }
});

app.get("/getLoaiSuKien", (req, res) => {
    try {
        connection.query(
            `
                Select A.Name, A.Id 
                From loai_sukien A 
                Where A.State = 0
            `,
            (err, rows, fields) => {
                if (err) return res.status(500).send({ status: "error" });
                return res.status(200).send({ status: "oke", data: rows });
            }
        );
    } catch (error) {
        console.log("🚀 ~ app.post ~ error:", error);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/getBirthforUser", (req, res) => {
    const { UserId } = req.body;
    try {
        connection.query(
            `
                Select A.Birth
                From user_infor A 
                Where A.State = 0
                And A.Id_User = ?
            `,
            [UserId],
            (err, rows, fields) => {
                if (err) return res.status(500).send({ status: "error" });

                return res.status(200).send({ status: "oke", data: rows });
            }
        );
    } catch (error) {
        console.log("🚀 ~ app.post ~ error:", error);
        return res.status(500).send({ status: "error" });
    }
});

module.exports = app;
