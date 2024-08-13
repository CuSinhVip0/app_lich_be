const express = require("express");
const app = express();
const connection = require("../services/index");
const lunarDate = require("../utils/lunarDate");
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

app.post("/test", (req, res) => {
    connection.query(
        `call LV_insertEventtoDatabase (?,  @ReturnMess );select @ReturnMess  AS ReturnMess;`,
        [JSON.stringify({ Id: 1, Ten: "a", Ngay: 2, Thang: 2 })],
        (err, rows, fields) => {
            if (err) console.log(err);
            return res.status(500).send({ status: JSON.parse(rows[1][0].ReturnMess) });
        }
    );
});

// const dbInfor = {
//     host: "sql12.freemysqlhosting.net",
//     user: "sql12721756",
//     password: "ZfFYgzVWu6",
//     database: "sql12721756",
//     dateStrings: true,
// };
// const mysql = require("mysql");
// const x = mysql.createConnection(dbInfor);
// app.get("/getAllSu2", (req, res) => {
//     x.query(`select * from su`, (err, rows, fields) => {
//         if (err) res.status(500).send(err);
//         res.status(200).send(rows);
//     });
// });

module.exports = app;
