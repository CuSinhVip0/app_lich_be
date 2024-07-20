const express = require("express");
const app = express();
const connection = require("../services/index");
const lunarDate = require("../utils/lunarDate");
const moment = require("moment");
app.post("/getEvents", (req, res) => {
    const { nam } = req.body;
    connection.query(
        `select  A.*
        from sukien  A
        ORDER By A.Thang ASC, A.Ngay ASC`,
        (err, rows, fields) => {
            if (err) res.status(500).send(err);
            var index = 0;
            var data = [];
            var next = true;
            var monthCurrent = 0;
            for (var i = 1; i <= 12; i++) {
                // thang
                for (var j = 1; j <= 31; j++) {
                    //nam
                    const lunar = lunarDate.convertSolar2Lunar(j, i, nam, 7); // chuyen ngay am sang ngay duong
                    const item = rows.filter((x) => (x.Thang == i && x.Ngay == j && x.DuongLich == 1) || (x.Thang == lunar[1] && x.Ngay == lunar[0] && x.DuongLich == 0)); // lay ra cac ngay co su kien

                    var year = nam;
                    if (lunar[1] == 1) next = false;
                    if (next) {
                        year = nam - 1;
                    }
                    if (item.length > 0)
                        item.map((x) => {
                            i < new Date().getMonth() + 1 && index++;

                            if (monthCurrent != i) {
                                monthCurrent = i;
                                data.push({
                                    thumnail: true,
                                    NgayDuong: j,
                                    NgayAm: lunar[0],
                                    ThangDuong: i,
                                    ThangAm: lunar[1],
                                    NamDuong: nam,
                                    NamAm: year,
                                });
                            } else data.push({ ...x, NgayDuong: j, NgayAm: lunar[0], ThangDuong: i, ThangAm: lunar[1], NamDuong: nam, NamAm: year, thumnail: false });
                        });
                }
            }
            res.status(200).send({ data: data, length: data.length, index: index });
        }
    );
});
app.post("/getDateEventToSetBookmark", (req, res) => {
    const { Nam, Thang, Key } = req.body;
    if (Key == 3) {
        const date1 = moment()
            .set("month", Thang - 1)
            .set("year", Nam);
        const date2 = moment().set("month", Thang).set("year", Nam);
        const date3 = moment()
            .set("month", Thang + 1)
            .set("year", Nam);
        const date_1 = moment()
            .set("month", Thang - 2)
            .set("year", Nam);
        const date_2 = moment()
            .set("month", Thang - 3)
            .set("year", Nam);

        const LunarBegin = lunarDate.convertSolar2Lunar(1, date_2.get("month") + 1, date_2.get("year"), 7);
        const LunarEnd = lunarDate.convertSolar2Lunar(new Date(Nam, date3.get("month") + 1, 0).getDate(), date3.get("month") + 1, date3.get("year"), 7);
        connection.query(
            `
           Select A.* 
           From 
           (

                Select  A.DuongLich, A.Ngay, A.Thang, A.Nam, A.Id_type_event
                From sukien  A
                Where A.Thang in (?,?,?,?,?)
                And A.DuongLich = 1

                UNION 

                Select B.DuongLich, B.Ngay,B.Thang,B.Nam, B.Id_type_event 
                From user_event  B
                Where B.Thang in (?,?,?,?,?)
                And B.Nam in (?,?,?,?,?)

                UNION

                Select C.DuongLich, C.Ngay,C.Thang,C.Nam, C.Id_type_event
                From sukien C
                Where C.Thang  between ? and ?
                And C.DuongLich = 0
            ) A
            ORDER By A.Thang ASC,A.Ngay ASC
        `,
            [
                //
                date_2.get("month") + 1,
                date_1.get("month") + 1,
                date1.get("month") + 1,
                date2.get("month") + 1,
                date3.get("month") + 1,

                //
                date_2.get("month") + 1,
                date_1.get("month") + 1,
                date1.get("month") + 1,
                date2.get("month") + 1,
                date3.get("month") + 1,

                //
                date_2.get("year"),
                date_1.get("year"),
                date1.get("year"),
                date2.get("year"),
                date3.get("year"),
                //
                LunarBegin[1],
                LunarEnd[1],
            ],
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                }

                const ListSolar = rows.filter((e) => e.DuongLich == 1);
                const ListLunar = rows.filter((e) => e.DuongLich == 0);

                for (var i = date_2.get("month") + 1; i <= date3.get("month") + 1; i++) {
                    var nam = moment(date_2).add(i, "month").get("year");

                    for (var j = 1; j <= new Date(nam, i, 0).getDate(); j++) {
                        const lunar = lunarDate.convertSolar2Lunar(j, i, nam, 7); // chuyen ngay am sang ngay duong
                        const item = ListLunar.filter((x) => x.Thang == lunar[1] && x.Ngay == lunar[0] && x.DuongLich == 0); // lay ra cac ngay co su kien
                        if (item.length > 0) {
                            ListSolar.push({
                                DuongLich: 0,
                                Ngay: j,
                                Thang: i,
                                Nam: nam,
                            });
                        }
                    }
                }
                ListSolar.sort((a, b) => a.Ngay - b.Ngay);
                const groupedItems = ListSolar.reduce((acc, item) => {
                    const category = item.Thang;
                    if (!acc[category]) {
                        acc[category] = [];
                    }
                    acc[category].push(item);
                    return acc;
                }, {});
                const groupedItemsArray = Object.entries(groupedItems);
                res.send([groupedItemsArray.slice(0, 2).reverse(), groupedItemsArray.slice(2)]);
            }
        );
    } else {
        const date = moment()
            .set("month", Thang - 1)
            .set("year", Nam);
        // lấy ngày đầu tiên và ngày kết thúc tháng âm  của tháng dương
        const LunarBegin = lunarDate.convertSolar2Lunar(1, Thang, Nam, 7);
        const LunarEnd = lunarDate.convertSolar2Lunar(new Date(Nam, Thang, 0).getDate(), Thang, Nam, 7);
        connection.query(
            `
           Select A.* 
           From 
           (
                Select  A.DuongLich, A.Ngay, A.Thang, A.Nam, A.Id_type_event 
                From sukien  A
                Where A.Thang  = ?
                And A.DuongLich = 1

                UNION 

                Select B.DuongLich, B.Ngay,B.Thang,B.Nam, B.Id_type_event 
                From user_event  B
                Where B.Thang = ?
                And B.Nam = ?

                UNION

                Select C.DuongLich, C.Ngay,C.Thang,C.Nam, C.Id_type_event
                From sukien C
                Where C.Thang  in (?)
                And C.DuongLich = 0

            ) A
            ORDER By A.Thang ASC,A.Ngay ASC
        `,
            [date.get("month") + 1, date.get("month") + 1, date.get("year"), [LunarBegin[1], LunarEnd[1]]],
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                }
                // xử lý phần âm
                const ListSolar = rows.filter((e) => e.DuongLich == 1);
                const ListLunar = rows.filter((e) => e.DuongLich == 0);
                for (var i = 1; i <= new Date(Nam, Thang, 0).getDate(); i++) {
                    const lunar = lunarDate.convertSolar2Lunar(i, Thang, Nam, 7); // chuyen ngay am sang ngay duong
                    const item = ListLunar.filter((x) => x.Thang == lunar[1] && x.Ngay == lunar[0] && x.DuongLich == 0); // lay ra cac ngay co su kien
                    if (item.length > 0) {
                        ListSolar.push({
                            DuongLich: 0,
                            Ngay: i,
                            Thang: Thang,
                            Nam: Nam,
                        });
                    }
                }
                ListSolar.sort((a, b) => a.Ngay - b.Ngay);
                res.send(ListSolar);
            }
        );
    }
});

app.get("/getAllEvent", (req, res) => {
    connection.query(
        `select  A.*
        from sukien  A
        ORDER By A.Thang ASC, A.Ngay ASC`,
        (err, rows, fields) => {
            res.send(rows);
        }
    );
});

app.post("/insertEvent", (req, res) => {
    const { Ten, Ngay, Thang, Nam, GioBatDau, GioKetThuc, ChiTiet, HandleRepeat, Remind, DuongLich, ToDay, ToMonth, ToYear, Type, Id_User } = req.body;
    try {
        connection.query(
            `
                Insert into user_event (Ten,Ngay,Thang,Nam,GioBatDau,GioKetThuc,ChiTiet,HandleRepeat,Remind,DuongLich,ToDay,ToMonth,ToYear,Id_type_event,Id_User) 
                Values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            `,
            [Ten, Ngay, Thang, Nam, GioBatDau, GioKetThuc, ChiTiet, HandleRepeat, Remind, DuongLich, ToDay, ToMonth, ToYear, Type, Id_User],
            (err, rows, fields) => {
                res.send({ status: "successfully", message: "Sự kiện của bạn đã được lưu 😘", id: rows.insertId });
            }
        );
    } catch (err) {
        res.send({ status: "error", message: "Xảy ra lỗi, vui lòng thử lại 😥" });
    }
});
app.post("/getTask", (req, res) => {
    const { Ngay, Thang, Nam } = req.body;
    const Lunar = lunarDate.convertSolar2Lunar(Ngay, Thang, Nam, 7);
    try {
        connection.query(
            `
                Select A.IdMain, A.Ten, A.ChiTiet, A.DuongLich, A.Ngay, A.Thang, A.Nam, A.ToDay, A.ToMonth, A.ToYear, A.GioBatDau, A.GioKetThuc, A.HandleRepeat, A.Remind, A.Name, A.Id
                From
                (
                    Select A.Id as IdMain, A.Ten, A.ChiTiet, A.DuongLich, A.Ngay, A.Thang, A.Nam, A.ToDay, A.ToMonth, A.ToYear, A.GioBatDau, A.GioKetThuc, A.HandleRepeat, A.Remind, B.Name, B.Id
                    From user_event A join loai_sukien B on A.Id_type_event = B.Id
                    Where A.State = 0
                    And 
                    (
                        (
                            A.Ngay = ?
                            And A.Thang = ?
                            And A.Nam = ?
                            And A.DuongLich = 1
                        )
                            or
                        (
                            A.Ngay = ?
                            And A.Thang = ?
                            And A.Nam = ?
                            And A.DuongLich = 0
                        )
                    )

                    UNION 
                    
                    Select B.Id as IdMain, B.Ten, B.ChiTiet, B.DuongLich, B.Ngay, B.Thang, B.Nam, B.Ngay as ToDay, B.Thang as ToMonth, B.Nam as ToYear, "00:00" as  GioBatDau, "24:00" as GioKetThuc, 0 as HandleRepeat, 0 as Remind, C.Name, C.Id
                    From sukien B join loai_sukien C on B.Id_type_event = C.Id
                    Where 
                    (
                        (
                            B.Ngay = ?
                            And B.Thang = ?
                            And B.DuongLich = 1
                        ) 
                        Or
                        (
                            B.Ngay = ?
                            And B.Thang = ?
                            And B.DuongLich = 0
                        )
                    )
                ) A
                Order by A.GioBatDau ASC, A.GioKetThuc ASC 
            `,
            [Ngay, Thang, Nam, Lunar[0], Lunar[1], Lunar[2], Ngay, Thang, Lunar[0], Lunar[1]],
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.send({ status: "error", result: "Xảy ra lỗi, vui lòng thử lại 😥" });
                }
                const groupedItems = rows.reduce((acc, item) => {
                    if ((item.GioBatDau == "00:00") & (item.GioKetThuc == "24:00")) {
                        if (!acc["Cả ngày"]) {
                            acc["Cả ngày"] = [];
                        }
                        acc["Cả ngày"].push(item);
                        return acc;
                    }
                    const category = item.GioBatDau;
                    if (!acc[category]) {
                        acc[category] = [];
                    }
                    acc[category].push(item);
                    return acc;
                }, {});
                const groupedItemsArray = Object.entries(groupedItems);

                res.send({ status: "successfully", result: rows == null ? [] : groupedItemsArray });
            }
        );
    } catch (err) {
        res.send({ status: "error", result: "Xảy ra lỗi, vui lòng thử lại 😥" });
    }
});

module.exports = app;
