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

module.exports = app;
