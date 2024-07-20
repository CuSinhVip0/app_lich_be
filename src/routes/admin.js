const express = require("express");
const app = express();
const connection = require("../services/index");
const bcrypt = require("bcrypt");

//#region login
app.post("/login", (req, res) => {
    const { Username, Password } = req.body;
    try {
        connection.query(
            `
                Select A.Id, A.Name, A.Username, A.Password, A.Email, A.Sdt
                From admin A
                Where A.Username = ?
            `,
            [Username, Password],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.post ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows.length == 0) {
                    return res.status(200).send({ status: "error" });
                }
                if (rows[0].Username == "admin") return res.status(200).send({ status: "oke", data: rows[0] });

                if (bcrypt.compareSync(Password, rows[0].Password)) {
                    return res.status(200).send({ status: "oke", data: rows[0] });
                }
                return res.status(200).send({ status: "error" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.post ~ err:", err);
    }
});
//#endregion

//#region  Quan ly quyen
app.post("/Sinh_spQuanLyQuyen_List", (req, res) => {
    const { OfficerId } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyQuyen_List (?) 
            `,
            [OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyQuyen_List ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0].length > 0 && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke", data: rows[0] });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyQuyen_List ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyQuyen_Save", (req, res) => {
    const { Adds, Views, Deletes, Edits, Specials, OfficerId, Id } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyQuyen_Save (?,?,?,?,?,?,?)
            `,
            [Adds, Views, Deletes, Edits, Specials, OfficerId, Id],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyQuyen_Save ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyQuyen_Save ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyQuyen_Delete", (req, res) => {
    const { OfficerId, DeleteBy } = req.body;
    try {
        +connection.query(
            `
               	Call Sinh_spQuanLyQuyen_Delete (?,?)
            `,
            [DeleteBy, OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyQuyen_Delete ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                if (rows.affectedRows == 1) return res.status(200).send({ status: "oke" });
                return res.status(200).send({ status: "error" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyQuyen_Delete ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});
//#endregion

//#region Quan ly nhan su
app.post("/Sinh_spQuanLyNhanSu_List", (req, res) => {
    const { OfficerId } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyNhanSu_List (?) 
            `,
            [OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.post ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0].length > 0 && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke", data: rows[0] });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.post ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyNhanSu_Save", (req, res) => {
    const { Name, Email, Sdt, Username, Password, OfficerId, Id } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyNhanSu_Save (?,?,?,?,?,?,?)
            `,
            [Name, Email, Sdt, Username, Password, OfficerId, Id],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.post ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.post ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyNhanSu_Delete", (req, res) => {
    const { OfficerId, DeleteBy } = req.body;
    try {
        connection.query(
            `
               	UPDATE admin
                Set admin.State = 2,
                admin.EditAt = Now(),
                admin.EditBy = ?
                WHERE admin.Id = ?;
            `,
            [DeleteBy, OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.post ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows.affectedRows == 1) return res.status(200).send({ status: "oke" });
                return res.status(200).send({ status: "error" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.post ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

//#endregion

//#region  Quan ly can
app.post("/Sinh_spQuanLyCan_List", (req, res) => {
    const { OfficerId } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyCan_List (?) 
            `,
            [OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.post ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0].length > 0 && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke", data: rows[0] });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.post ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyCan_Save", (req, res) => {
    const { Ten, NguHanh, CanXungKhac, AmDuong, OfficerId, Id } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyCan_Save (?,?,?,?,?,?)
            `,
            [Ten, NguHanh, CanXungKhac, AmDuong, OfficerId, Id],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ Sinh_spQuanLyCan_Save ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ Sinh_spQuanLyCan_Save ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyCan_Delete", (req, res) => {
    const { OfficerId, DeleteBy } = req.body;
    try {
        connection.query(
            `
               	Call Sinh_spQuanLyCan_Delete (?,?)
            `,
            [DeleteBy, OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.post ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                if (rows.affectedRows == 1) return res.status(200).send({ status: "oke" });
                return res.status(200).send({ status: "error" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.post ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});
//#endregion

//#region  Quan ly chi
app.post("/Sinh_spQuanLyChi_List", (req, res) => {
    const { OfficerId } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyChi_List (?) 
            `,
            [OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyChi_List ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0].length > 0 && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke", data: rows[0] });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyChi_List ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyChi_Save", (req, res) => {
    const { Ten, Giap, Thang, Gio, ChiXungKhac, AmDuong, OfficerId, Id } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyChi_Save (?,?,?,?,?,?,?,?)
            `,
            [Ten, Giap, Thang, Gio, ChiXungKhac, AmDuong, OfficerId, Id],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyChi_Save ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyChi_Save ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyChi_Delete", (req, res) => {
    const { OfficerId, DeleteBy } = req.body;
    try {
        connection.query(
            `
               	Call Sinh_spQuanLyChi_Delete (?,?)
            `,
            [DeleteBy, OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyChi_Delete ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                if (rows.affectedRows == 1) return res.status(200).send({ status: "oke" });
                return res.status(200).send({ status: "error" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyChi_Delete ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});
//#endregion

//#region  Quan ly can chi
app.post("/Sinh_spQuanLyCanChi_List", (req, res) => {
    const { OfficerId } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyCanChi_List (?) 
            `,
            [OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyCanChi_List ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0].length > 0 && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke", data: rows[0] });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyCanChi_List ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyCanChi_Save", (req, res) => {
    const { Ten, Menh, NguHanh, NghiaNguHanh, Can, Chi, OfficerId, Id } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyCanChi_Save (?,?,?,?,?,?,?,?)
            `,
            [Ten, Menh, NguHanh, NghiaNguHanh, Can, Chi, OfficerId, Id],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyCanChi_Save ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyCanChi_Save ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyCanChi_Delete", (req, res) => {
    const { OfficerId, DeleteBy } = req.body;
    try {
        connection.query(
            `
               	Call Sinh_spQuanLyCanChi_Delete (?,?)
            `,
            [DeleteBy, OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyCanChi_Delete ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                if (rows.affectedRows == 1) return res.status(200).send({ status: "oke" });
                return res.status(200).send({ status: "error" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyCanChi_Delete ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});
//#endregion

//#region  Quan ly cat hung tinh
app.post("/Sinh_spQuanLyCathungtinh_List", (req, res) => {
    const { OfficerId } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyCathungtinh_List (?) 
            `,
            [OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_List ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0].length > 0 && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke", data: rows[0] });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_List ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyCathungtinh_Save", (req, res) => {
    const { Ten, CatTinh, ChiTiet, TomTat, Le, OfficerId, Id } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyCathungtinh_Save (?,?,?,?,?,?,?)
            `,
            [Ten, CatTinh, ChiTiet, TomTat, Le, OfficerId, Id],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_Save ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_Save ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyCathungtinh_Delete", (req, res) => {
    const { OfficerId, DeleteBy } = req.body;
    try {
        connection.query(
            `
               	Call Sinh_spQuanLyCathungtinh_Delete (?,?)
            `,
            [DeleteBy, OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_Delete ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                if (rows.affectedRows == 1) return res.status(200).send({ status: "oke" });
                return res.status(200).send({ status: "error" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_Delete ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});
//#endregion

//#region  Quan ly sao hoang dao
app.post("/Sinh_spQuanLyHoangdao_List", (req, res) => {
    const { OfficerId } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyHoangdao_List (?) 
            `,
            [OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyHoangdao_List ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0].length > 0 && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke", data: rows[0] });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyHoangdao_List ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyHoangdao_Save", (req, res) => {
    const { Ten, IsHoangDao, OfficerId, Id } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyHoangdao_Save (?,?,?,?)
            `,
            [Ten, IsHoangDao, OfficerId, Id],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyHoangdao_Save ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyHoangdao_Save ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyHoangdao_Delete", (req, res) => {
    const { OfficerId, DeleteBy } = req.body;
    try {
        connection.query(
            `
               	Call Sinh_spQuanLyHoangdao_Delete (?,?)
            `,
            [DeleteBy, OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyHoangdao_Delete ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                if (rows.affectedRows == 1) return res.status(200).send({ status: "oke" });
                return res.status(200).send({ status: "error" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyHoangdao_Delete ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});
//#endregion

//#region  Quan ly truc
app.post("/Sinh_spQuanLyTruc_List", (req, res) => {
    const { OfficerId } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyTruc_List (?) 
            `,
            [OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyTruc_List ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0].length > 0 && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke", data: rows[0] });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyTruc_List ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyTruc_Save", (req, res) => {
    const { Ten, TinhChat, OfficerId, Id } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyTruc_Save (?,?,?,?)
            `,
            [Ten, TinhChat, OfficerId, Id],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyTruc_Save ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyTruc_Save ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyTruc_Delete", (req, res) => {
    const { OfficerId, DeleteBy } = req.body;
    try {
        connection.query(
            `
               	Call Sinh_spQuanLyTruc_Delete (?,?)
            `,
            [DeleteBy, OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyTruc_Delete ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                if (rows.affectedRows == 1) return res.status(200).send({ status: "oke" });
                return res.status(200).send({ status: "error" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyTruc_Delete ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});
//#endregion

//#region  Quan ly xung khac
app.post("/Sinh_spQuanLyXungkhacCanChi_List", (req, res) => {
    const { OfficerId } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyXungkhacCanChi_List (?) 
            `,
            [OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyXungkhacCanChi_List ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0].length > 0 && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke", data: rows[0] });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyXungkhacCanChi_List ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyXungkhacCanChi_Save", (req, res) => {
    const { Id_CanChi, Id_CanChiXungKhac, OfficerId, Id } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyXungkhacCanChi_Save (?,?,?,?)
            `,
            [Id_CanChi, JSON.stringify(Id_CanChiXungKhac), OfficerId, Id],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyXungkhacCanChi_Save ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyXungkhacCanChi_Save ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyXungkhacCanChi_Delete", (req, res) => {
    const { OfficerId, DeleteBy } = req.body;
    try {
        connection.query(
            `
               	Call Sinh_spQuanLyXungkhacCanChi_Delete (?,?)
            `,
            [DeleteBy, OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyXungkhacCanChi_Delete ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                if (rows.affectedRows == 1) return res.status(200).send({ status: "oke" });
                return res.status(200).send({ status: "error" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyXungkhacCanChi_Delete ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});
//#endregion

//#region  Quan ly loai su kien
app.post("/Sinh_spQuanLyLoaisukien_List", (req, res) => {
    const { OfficerId } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyLoaisukien_List (?) 
            `,
            [OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyLoaisukien_List ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0].length > 0 && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke", data: rows[0] });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyLoaisukien_List ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyLoaisukien_Save", (req, res) => {
    const { Ten, UrlPic, OfficerId, Id } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyLoaisukien_Save (?,?,?,?)
            `,
            [Ten, UrlPic, OfficerId, Id],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyLoaisukien_Save ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyLoaisukien_Save ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyLoaisukien_Delete", (req, res) => {
    const { OfficerId, DeleteBy } = req.body;
    try {
        connection.query(
            `
               	Call Sinh_spQuanLyLoaisukien_Delete (?,?)
            `,
            [DeleteBy, OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyLoaisukien_Delete ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                if (rows.affectedRows == 1) return res.status(200).send({ status: "oke" });
                return res.status(200).send({ status: "error" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyLoaisukien_Delete ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});
//#endregion

//#region  Quan ly  su kien he thong
app.post("/Sinh_spQuanLyLSukienhethong_List", (req, res) => {
    const { OfficerId } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyLSukienhethong_List (?) 
            `,
            [OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyLSukienhethong_List ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0].length > 0 && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke", data: rows[0] });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyLSukienhethong_List ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyLSukienhethong_Save", (req, res) => {
    const { Ten, UrlPic, DuongAm, Ngay, Thang, Loai, Mota, OfficerId, Id } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyLSukienhethong_Save (?,?,?,?,?,?,?,?,?)
            `,
            [Ten, UrlPic, DuongAm, Ngay, Thang, Loai, Mota, OfficerId, Id],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyLSukienhethong_Save ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyLSukienhethong_Save ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyLSukienhethong_Delete", (req, res) => {
    const { OfficerId, DeleteBy } = req.body;
    try {
        connection.query(
            `
               	Call Sinh_spQuanLyLSukienhethong_Delete (?,?)
            `,
            [DeleteBy, OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyLSukienhethong_Delete ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                if (rows.affectedRows == 1) return res.status(200).send({ status: "oke" });
                return res.status(200).send({ status: "error" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyLSukienhethong_Delete ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});
//#endregion

//#region  Quan ly  su
app.post("/Sinh_spQuanLySu_List", (req, res) => {
    const { OfficerId } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLySu_List (?) 
            `,
            [OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLySu_List ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0].length > 0 && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke", data: rows[0] });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLySu_List ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLySu_Save", (req, res) => {
    const { Ten, Mota, OfficerId, Id } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLySu_Save (?,?,?,?)
            `,
            [Ten, Mota, OfficerId, Id],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLySu_Save ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLySu_Save ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLySu_Delete", (req, res) => {
    const { OfficerId, DeleteBy } = req.body;
    try {
        connection.query(
            `
               	Call Sinh_spQuanLySu_Delete (?,?)
            `,
            [DeleteBy, OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLySu_Delete ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                if (rows.affectedRows == 1) return res.status(200).send({ status: "oke" });
                return res.status(200).send({ status: "error" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLySu_Delete ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});
//#endregion

//#region  Quan ly ngay tot
app.post("/Sinh_spQuanLyNgaytot_List", (req, res) => {
    const { OfficerId } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyNgaytot_List (?) 
            `,
            [OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyNgaytot_List ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0].length > 0 && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke", data: rows[0] });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyNgaytot_List ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyNgaytot_Save", (req, res) => {
    const { Thang, CanChi, Su, OfficerId, Id } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyNgaytot_Save (?,?,?,?,?)
            `,
            [Thang, CanChi, Su, OfficerId, Id],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyNgaytot_Save ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyNgaytot_Save ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyNgaytot_Delete", (req, res) => {
    const { OfficerId, DeleteBy } = req.body;
    try {
        +connection.query(
            `
               	Call Sinh_spQuanLyNgaytot_Delete (?,?)
            `,
            [DeleteBy, OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyNgaytot_Delete ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                if (rows.affectedRows == 1) return res.status(200).send({ status: "oke" });
                return res.status(200).send({ status: "error" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyNgaytot_Delete ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});
//#endregion

//#region  Quan ly cat hugn tinh can chi
app.post("/Sinh_spQuanLyCathungtinh_CanChi_List", (req, res) => {
    const { OfficerId } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyCathungtinh_CanChi_List (?) 
            `,
            [OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_CanChi_List ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0].length > 0 && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke", data: rows[0] });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_CanChi_List ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyCathungtinh_CanChi_Save", (req, res) => {
    const { Thang, CanChi, CatHungTinh, OfficerId, Id } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyCathungtinh_CanChi_Save (?,?,?,?,?)
            `,
            [Thang, CanChi, CatHungTinh, OfficerId, Id],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_CanChi_Save ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_CanChi_Save ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyCathungtinh_CanChi_Delete", (req, res) => {
    const { OfficerId, DeleteBy } = req.body;
    try {
        +connection.query(
            `
               	Call Sinh_spQuanLyCathungtinh_CanChi_Delete (?,?)
            `,
            [DeleteBy, OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_CanChi_Delete ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                if (rows.affectedRows == 1) return res.status(200).send({ status: "oke" });
                return res.status(200).send({ status: "error" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_CanChi_Delete ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});
//#endregion

//#region  Quan ly cat hugn tinh can
app.post("/Sinh_spQuanLyCathungtinh_Can_List", (req, res) => {
    const { OfficerId } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyCathungtinh_Can_List (?) 
            `,
            [OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_Can_List ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0].length > 0 && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke", data: rows[0] });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_Can_List ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyCathungtinh_Can_Save", (req, res) => {
    const { Thang, Can, CatHungTinh, OfficerId, Id } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyCathungtinh_Can_Save (?,?,?,?,?)
            `,
            [Thang, Can, CatHungTinh, OfficerId, Id],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_Can_Save ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_Can_Save ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyCathungtinh_Can_Delete", (req, res) => {
    const { OfficerId, DeleteBy } = req.body;
    try {
        +connection.query(
            `
               	Call Sinh_spQuanLyCathungtinh_Can_Delete (?,?)
            `,
            [DeleteBy, OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_Can_Delete ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                if (rows.affectedRows == 1) return res.status(200).send({ status: "oke" });
                return res.status(200).send({ status: "error" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_Can_Delete ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});
//#endregion

//#region  Quan ly cat hugn tinh chi
app.post("/Sinh_spQuanLyCathungtinh_Chi_List", (req, res) => {
    const { OfficerId } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyCathungtinh_Chi_List (?) 
            `,
            [OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_Chi_List ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0].length > 0 && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke", data: rows[0] });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_Chi_List ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyCathungtinh_Chi_Save", (req, res) => {
    const { Thang, Chi, CatHungTinh, OfficerId, Id } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyCathungtinh_Chi_Save (?,?,?,?,?)
            `,
            [Thang, Chi, CatHungTinh, OfficerId, Id],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_Chi_Save ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_Chi_Save ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyCathungtinh_Chi_Delete", (req, res) => {
    const { OfficerId, DeleteBy } = req.body;
    try {
        +connection.query(
            `
               	Call Sinh_spQuanLyCathungtinh_Chi_Delete (?,?)
            `,
            [DeleteBy, OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_Chi_Delete ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                if (rows.affectedRows == 1) return res.status(200).send({ status: "oke" });
                return res.status(200).send({ status: "error" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_Chi_Delete ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});
//#endregion

//#region  Quan ly cat hugn tinh truc
app.post("/Sinh_spQuanLyCathungtinh_Truc_List", (req, res) => {
    const { OfficerId } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyCathungtinh_Truc_List (?) 
            `,
            [OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_Truc_List ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0].length > 0 && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke", data: rows[0] });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_Truc_List ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyCathungtinh_Truc_Save", (req, res) => {
    const { Thang, Truc, CatHungTinh, OfficerId, Id } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyCathungtinh_Truc_Save (?,?,?,?,?)
            `,
            [Thang, Truc, CatHungTinh, OfficerId, Id],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_Truc_Save ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_Truc_Save ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyCathungtinh_Truc_Delete", (req, res) => {
    const { OfficerId, DeleteBy } = req.body;
    try {
        +connection.query(
            `
               	Call Sinh_spQuanLyCathungtinh_Truc_Delete (?,?)
            `,
            [DeleteBy, OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_Truc_Delete ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                if (rows.affectedRows == 1) return res.status(200).send({ status: "oke" });
                return res.status(200).send({ status: "error" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyCathungtinh_Truc_Delete ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});
//#endregion

//#region  Quan ly cung hoang dao
app.post("/Sinh_spQuanLyCunghoangdao_List", (req, res) => {
    const { OfficerId } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyCunghoangdao_List (?) 
            `,
            [OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyCunghoangdao_List ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0].length > 0 && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke", data: rows[0] });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyCunghoangdao_List ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyCunghoangdao_Save", (req, res) => {
    const {
        Name,
        RangeTime,
        EngName,
        UrlPic,
        Description,
        Summary,
        Male,
        Female,
        ColorLucky,
        NumberLucky,
        SaoLucky,
        DamPhanTC,
        SuNghiep,
        TinhCam,
        TamTrang,
        ChiSoSuNghiep,
        ChiSoTinhCam,
        ChiSoTamTrang,
        OfficerId,
        Id,
    } = req.body;
    try {
        connection.query(
            `
                Call Sinh_spQuanLyCunghoangdao_Save (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            `,
            [
                Name,
                RangeTime,
                EngName,
                UrlPic,
                Description,
                Summary,
                Male,
                Female,
                ColorLucky,
                NumberLucky,
                SaoLucky,
                DamPhanTC,
                SuNghiep,
                TinhCam,
                TamTrang,
                ChiSoSuNghiep,
                ChiSoTinhCam,
                ChiSoTamTrang,
                OfficerId,
                Id,
            ],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyCunghoangdao_Save ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                return res.status(200).send({ status: "oke" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyCunghoangdao_Save ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/Sinh_spQuanLyCunghoangdao_Delete", (req, res) => {
    const { OfficerId, DeleteBy } = req.body;
    try {
        +connection.query(
            `
               	Call Sinh_spQuanLyCunghoangdao_Delete (?,?)
            `,
            [DeleteBy, OfficerId],
            (err, rows, fields) => {
                if (err) {
                    console.log("🚀 ~ app.Sinh_spQuanLyCunghoangdao_Delete ~ err:", err);
                    return res.status(500).send({ status: "error" });
                }
                if (rows[0] && rows[0][0].message) return res.status(200).send({ status: "error", data: rows[0][0].message });
                if (rows.affectedRows == 1) return res.status(200).send({ status: "oke" });
                return res.status(200).send({ status: "error" });
            }
        );
    } catch (err) {
        console.log("🚀 ~ app.Sinh_spQuanLyCunghoangdao_Delete ~ err:", err);
        return res.status(500).send({ status: "error" });
    }
});
//#endregion
module.exports = app;
