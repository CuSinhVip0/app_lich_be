const express = require("express");
const app = express();
const connection = require("../services/index");
const lunarDate = require("../utils/lunarDate");
const moment = require("moment");
app.post("/LV_getEvents", (req, res) => {
    const { nam } = req.body;
    connection.query(
        `
            Select A.IdMain, A.Ten, A.ChiTiet, A.DuongLich, A.Ngay, A.Thang, A.Nam, A.GioBatDau, A.GioKetThuc, A.Name, A.Id, A.EventSystem,A.UrlPic
            From 
            (
                Select A.Id as IdMain, A.Ten, A.ChiTiet, A.DuongLich, A.Ngay, A.Thang, A.Nam, A.GioBatDau, A.GioKetThuc, B.Name, B.Id,  1 as  EventSystem, A.UrlPic
                From sukien  A 
                Inner Join loai_sukien B on A.Id_type_event = B.Id 
                Where A.State = 0
            ) A
            ORDER By A.Thang ASC, A.Ngay ASC    
        `,
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
                                    IsToday: i == new Date().getMonth() + 1 && nam == new Date().getFullYear() ? true : false,
                                });
                            } else
                                data.push({ ...x, NgayDuong: j, NgayAm: lunar[0], ThangDuong: i, ThangAm: lunar[1], NamDuong: nam, NamAm: year, thumnail: false, IsToday: false });
                        });
                }
            }
            res.status(200).send({ data: data, length: data.length, index: index });
        }
    );
});
app.post("/getDateEventToSetBookmark", (req, res) => {
    const { Nam, Thang, Key, IdUser } = req.body;

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
                Select A.DuongLich, A.Ngay, A.Thang
                From 
                (

                        Select  A.DuongLich, A.Ngay, A.Thang, A.Nam, A.Id_type_event
                        From sukien  A
                        Where A.Thang in (?,?,?,?,?) and A.State = 0 
                        And A.DuongLich = 1

                        UNION 

                        Select B.DuongLich, B.Ngay,B.Thang,B.Nam, B.Id_type_event 
                        From user_event B
                        Where B.Thang in (?,?,?,?,?) and B.State = 0 and  B.Id_User = ?
                        And B.Nam in (?,?,?,?,?)

                        UNION

                        Select C.DuongLich, C.Ngay,C.Thang,C.Nam, C.Id_type_event
                        From sukien C
                        Where C.Thang  between ? and ? and C.State = 0
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
                IdUser,
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

                var ListSolar = rows.filter((e) => e.DuongLich == 1);
                const ListLunar = rows.filter((e) => e.DuongLich == 0);

                for (var i = date_2.get("month") + 1; i <= date3.get("month") + 1; i++) {
                    var nam = moment(date_2).add(1, "month").get("year");
                    for (var j = 1; j <= 31; j++) {
                        const lunar = lunarDate.convertSolar2Lunar(j, i, nam, 7);
                        const item = ListLunar.filter((x) => x.Thang == lunar[1] && x.Ngay == lunar[0] && x.DuongLich == 0);
                        if (item.length > 0) {
                            ListSolar.push({
                                DuongLich: 1,
                                Ngay: j,
                                Thang: i,
                            });
                        }
                    }
                }
                ListSolar.sort((a, b) => a.Ngay - b.Ngay);
                ListSolar = ListSolar.filter(
                    (item, index, self) => index === self.findIndex((t) => t.DuongLich === item.DuongLich && t.Thang === item.Thang && t.Ngay === item.Ngay)
                );

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
                Where A.Thang  = ? and A.State = 0
                And A.DuongLich = 1

                UNION 

                Select B.DuongLich, B.Ngay,B.Thang,B.Nam, B.Id_type_event 
                From user_event  B
                Where B.Thang = ? and B.State = 0  and  B.Id_User = ?
                And B.Nam = ?

                UNION

                Select C.DuongLich, C.Ngay,C.Thang,C.Nam, C.Id_type_event
                From sukien C
                Where C.Thang  in (?) and C.State = 0
                And C.DuongLich = 0

            ) A
            ORDER By A.Thang ASC,A.Ngay ASC
        `,
            [date.get("month") + 1, date.get("month") + 1, IdUser, date.get("year"), [LunarBegin[1], LunarEnd[1]]],
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                }
                // xử lý phần âm
                var ListSolar = rows.filter((e) => e.DuongLich == 1);
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
                ListSolar = ListSolar.filter(
                    (item, index, self) => index === self.findIndex((t) => t.DuongLich === item.DuongLich && t.Thang === item.Thang && t.Ngay === item.Ngay)
                );
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

app.post("/LV_insertEventtoDatabase", (req, res) => {
    const { Id, Ten, Ngay, Thang, Nam, GioBatDau, GioKetThuc, ChiTiet, HandleRepeat, Remind, DuongLich, ToDay, ToMonth, ToYear, Type, Id_User } = req.body;
    try {
        connection.query(
            `
                Call LV_insertEventtoDatabase (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

            `,
            [Id, Ten, DuongLich, Ngay, Thang, Nam, ToDay, ToMonth, ToYear, ChiTiet, GioBatDau, GioKetThuc, HandleRepeat, Remind, Type, Id_User],
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ status: "error", message: "Xảy ra lỗi, vui lòng thử lại 😥" });
                }
                if (rows[0] && rows[0][0].id) return res.status(200).send({ status: "oke", message: "Sự kiện của bạn đã được lưu 😘", id: rows[0][0].id });
                return res.status(200).send({ status: "oke" });
            }
        );
    } catch (err) {
        res.send({ status: "error", message: "Xảy ra lỗi, vui lòng thử lại 😥" });
    }
});
app.post("/LV_getTaskfromDatabase", (req, res) => {
    const { Ngay, Thang, Nam, IdUser } = req.body;

    const Lunar = lunarDate.convertSolar2Lunar(Ngay, Thang, Nam, 7);
    try {
        connection.query(
            `
                Select A.IdMain, A.Ten, A.ChiTiet, A.DuongLich, A.Ngay, A.Thang, A.Nam, A.ToDay, A.ToMonth, A.ToYear, A.GioBatDau, A.GioKetThuc, A.HandleRepeat, A.Remind, A.Name, A.Id, A.EventSystem,A.UrlPic
                From
                (
                    Select A.Id as IdMain, A.Ten, A.ChiTiet, A.DuongLich, A.Ngay, A.Thang, A.Nam, A.ToDay, A.ToMonth, A.ToYear, A.GioBatDau, A.GioKetThuc, A.HandleRepeat, A.Remind, B.Name, B.Id,  0 as EventSystem,'' as UrlPic
                    From user_event A join loai_sukien B on A.Id_type_event = B.Id 
                    Where A.State = 0 and  A.Id_User = ?
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
                    
                    Select B.Id as IdMain, B.Ten, B.ChiTiet, B.DuongLich, B.Ngay, B.Thang, B.Nam, B.Ngay as ToDay, B.Thang as ToMonth, B.Nam as ToYear, "00:00" as  GioBatDau, "24:00" as GioKetThuc, 0 as HandleRepeat, 0 as Remind, C.Name, C.Id, 1 as EventSystem,B.UrlPic
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
            [IdUser, Ngay, Thang, Nam, Lunar[0], Lunar[1], Lunar[2], Ngay, Thang, Lunar[0], Lunar[1]],
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
        console.log(err);
        res.send({ status: "error", result: "Xảy ra lỗi, vui lòng thử lại 😥" });
    }
});

app.post("/LV_removeTaskfromDatabase", (req, res) => {
    const { Id } = req.body;
    try {
        connection.query("Delete from user_event where Id = ?", [Id], (err, rows, fields) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ status: "error" });
            }
            return res.status(200).send({ status: "oke" });
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/LV_getInforTaskfromDatabase", (req, res) => {
    const { Id, Type } = req.body;
    console.log("🚀 ~ app.post ~  Id, Type:", Id, Type);
    try {
        connection.query("Call LV_getInforTaskfromDatabase (?,?)", [Id, Type], (err, rows, fields) => {
            if (err) {
                console.log("🚀 ~ app.LV_spGetInforFromDatabase ~ err:", err);
                return res.status(500).send({ status: "error" });
            }
            if (rows.length > 0 && rows[0])
                return res.status(200).send({
                    status: "oke",
                    data: rows[0][0],
                });
            return res.status(200).send({ status: "error" });
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ status: "error" });
    }
});

module.exports = app;
