const express = require("express");
const app = express();
const connection = require("../services/index");
var moment = require("moment");
var sao = require("../enum/sao");

app.post("/getThongTinNgay", (req, res) => {
    const { Can, Chi, ngayduong, ngayam, CanChiNam, CanChiThang } = req.body;

    const thangAm = moment(ngayam, "MM-DD-YYYY").month() + 1;
    //lay menh nam
    var menhNam = new Promise(function (resolve, reject) {
        connection.query(`SELECT  A.Ten,A.Menh,A.NguHanh,A.NghiaNguHanh from  CANCHI  A Where A.Ten = '${CanChiNam}' `, (err, rows, fields) => {
            if (err) reject(err);
            resolve(rows[0]);
        });
    });

    //lay data ngay xung khacs
    var xungkhac = new Promise(function (resolve, reject) {
        connection.query(
            `select C.Id,C.Ten,C.Menh,C.NguHanh,C.NghiaNguHanh
            from xungkhac A
            inner join canchi B on A.Id_canchi = B.Id
            inner join canchi C on A.Id_xungkhac = C.Id
             WHERE B.Ten = ?`,
            [Can + " " + Chi],
            (err, rows, fields) => {
                if (err) reject(err);
                resolve(rows);
            }
        );
    });

    //lay data ngay
    var menhngay = new Promise(function (resolve, reject) {
        connection.query(`SELECT  A.Id,A.Ten,A.Menh,A.NguHanh,A.NghiaNguHanh from  CANCHI  A Where A.Ten = '${Can + " " + Chi}' `, (err, rows, fields) => {
            if (err) reject(err);
            resolve(rows[0]);
        });
    });

    //sao
    var index =
        moment(ngayduong, "MM-DD-YYYY").isoWeekday() == 1
            ? moment(ngayduong, "MM-DD-YYYY").isoWeekday() - 1 + (moment(ngayam, "MM-DD-YYYY").week() % 4)
            : (moment(ngayduong, "MM-DD-YYYY").isoWeekday() - 1) * 4 + (moment(ngayam, "MM-DD-YYYY").week() % 4);

    //than
    const thanOptions =
        thangAm == 1 || thangAm == 7
            ? 0
            : thangAm == 2 || thangAm == 8
            ? 2
            : thangAm == 3 || thangAm == 9
            ? 4
            : thangAm == 4 || thangAm == 10
            ? 6
            : thangAm == 5 || thangAm == 11
            ? 8
            : 10;

    var than = new Promise(function (resolve, reject) {
        connection.query(
            `Select A.Ten, A.IsHoangDao
				From (
				Select A.ten as chi, B.Ten, B.IsHoangDao
					From Chi  A 
				Inner Join HOANGDAO B on A.id  = B.Id + ?
				Union All
				Select A.ten as chi, B.Ten, B.IsHoangDao
				From Chi  A 
				Inner Join HOANGDAO B on (12-?)+A.id  = B.Id
			)A
		Where A.chi = ?`,
            [thanOptions, thanOptions, Chi],
            (err, rows, fields) => {
                if (err) reject(err);
                resolve(rows[0]);
            }
        );
    });

    //truc

    var truc = new Promise(function (resolve, reject) {
        connection.query(
            `Select A.Ten,A.TinhChat
            From (
                Select A.ten as chi, B.Ten,B.TinhChat
                From Chi  A 
                Inner Join truc B on A.id  = B.Id + ?
                Union All
                Select A.ten as chi, B.Ten,B.TinhChat
                From Chi  A 
                Inner Join truc B on (12-?)+A.id  = B.Id
            )A
            Where  A.chi RLIKE ?`,
            [thangAm + 1, thangAm + 1, Chi],
            (err, rows, fields) => {
                if (err) reject(err);
                resolve(rows[0]);
            }
        );
    });

    //#region xuat hanh
    const xuathanh = {
        hythan: "",
        taithan: "",
        hacthan: "",
    };
    // hy than
    if (Can == "Giáp" || Can == "Kỷ") xuathanh.hythan = "Hướng Đông Bắc";
    else if (Can == "Ất" || Can == "Canh") xuathanh.hythan = "Hướng Tây Bắc";
    else if (Can == "Bính" || Can == "Tân") xuathanh.hythan = "Hướng Tây Nam";
    else if (Can == "Đinh" || Can == "Nhâm") xuathanh.hythan = "Hướng chính Nam";
    else xuathanh.hythan = "Hướng Đông Nam";
    // tai than
    if (Can == "Giáp" || Can == "Ất") xuathanh.taithan = "Hướng Đông Nam";
    else if (Can == "Bính" || Can == "Đinh") xuathanh.taithan = "Hướng chính Đông";
    else if (Can == "Mậu" || Can == "Kỷ") xuathanh.taithan = "Hướng chính Nam";
    else if (Can == "Canh" || Can == "Tân") xuathanh.taithan = "Hướng Tây Nam";
    else xuathanh.taithan = "Hướng chính Tây";

    // hac than
    var hac = new Promise(function (resolve, reject) {
        connection.query(
            `Select A.Id
            From canchi A
            Where  A.Ten RLIKE ?`,
            [Can + " " + Chi],
            (err, rows, fields) => {
                if (err) reject(err);
                const index = rows.length > 0 ? rows[0].Id : "";
                if (index >= 30 && index <= 45) xuathanh.hacthan = "Ở trên trời (khỏi lo đi !!!)";
                else if (index > 45 && index <= 51) xuathanh.hacthan = "Hướng Đông Bắc";
                else if (index > 51 && index <= 56) xuathanh.hacthan = "Hướng chính Đông";
                else if ((index > 56 && index <= 60) || (index > 0 && index <= 2)) xuathanh.hacthan = "Hướng Đông Nam";
                else if (index > 2 && index <= 7) xuathanh.hacthan = "Hướng chính Nam";
                else if (index > 7 && index <= 13) xuathanh.hacthan = "Hướng Tây Nam";
                else if (index > 13 && index <= 18) xuathanh.hacthan = "Hướng chính Tây";
                else if (index > 18 && index <= 24) xuathanh.hacthan = "Hướng Tây Bắc";
                else if (index > 24 && index <= 29) xuathanh.hacthan = "Hướng chính Bắc";
                resolve(xuathanh);
            }
        );
    });
    //#endregion

    Promise.all([menhngay, menhNam, than, truc, hac, xungkhac]).then((data) => {
        //xu ly cat hung tinh
        const cathungtinh = new Promise(function (resolve, reject) {
            connection.query(
                `select B.Thang, A.*from cathungtinh A
                join kn_cathungtinh_chi B on A.Id = B.Id_cathungtinh 
                join chi C on B.Id_chi = C.id
                WHERE B.Thang =? and C.Ten   LIKE '%${Chi}%'
                UNION ALL
               
                select D.Thang, A.* from cathungtinh A
                join kn_cathungtinh_truc D on A.Id = D.Id_cathungtinh 
                join truc E on D.Id_truc = E.id 
                WHERE D.Thang =? and E.Ten =?
                UNION ALL
               
                select F.Thang, A.* from cathungtinh A
                join kn_cathungtinh_can F on A.Id = F.Id_cathungtinh 
                join can G on F.Id_can = G.Id 
                WHERE F.Thang =? and G.Ten =?
                UNION ALL
                
                select H.Thang, A.* from cathungtinh A
                join kn_cathungtinh_canchi H on A.Id = H.Id_cathungtinh  
                join canchi K on H.Id_canchi = K.Id
                WHERE H.Thang =? and K.Ten =?
               `,
                [4, 4, data[3].Ten, 4, Can, 4, Can + " " + Chi],
                (err, rows, fields) => {
                    if (err) reject(err);
                    resolve(rows);
                }
            );
        });
        var cattinh = [];
        var hungtinh = [];

        cathungtinh
            .then((data) => {
                hungtinh = data.filter((i) => i.CatTinh == 0);
                cattinh = data.filter((i) => i.CatTinh != 0);
            })
            .finally(() => {
                res.send({
                    menhngay: {
                        Ten: data[0] ? data[0].Ten : "",
                        Menh: data[0] ? data[0].Menh : "",
                        NguHanh: data[0] ? data[0].NguHanh : "",
                        NghiaNguHanh: data[0] ? data[0].NghiaNguHanh : "",
                    },
                    xungkhac: data[5],
                    menhnam: data[1],
                    sao: { Ten: sao[index] },
                    than: data[2],
                    truc: data[3],
                    xuathanh: data[4],
                    cattinh: cattinh,
                    hungtinh: hungtinh,
                });
            });
    });
});

module.exports = app;
