const express = require("express");
const app = express();

const connection = require("../services/index");

app.post("/updatePosttoDataBase", (req, res) => {
    const { Title, Type, UrlImages, Id_User } = req.body;
    try {
        connection.query(
            `
                Insert into user_post (Title,Type,Id_User)
                Values (?,?,?)
            `,
            [Title, Type, Id_User],
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).send({ status: "error" });
                }
                const newId = rows.insertId;
                if (rows.affectedRows != 0) {
                    if (UrlImages.length == 0) return res.status(200).send({ status: "oke", newId: newId, title: Title });
                    try {
                        connection.query(
                            `
                                Insert into post_img (Url,Id_Post)
                                Values  ?
                            `,
                            [
                                UrlImages.map((data) => {
                                    return [data, newId];
                                }),
                            ],
                            (err, rows, fields) => {
                                if (err) {
                                    res.status(500).send({ status: "error" });
                                }
                                res.status(200).send({ status: "oke", newId: newId, title: Title });
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
    } catch (e) {
        console.log(e);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/getPostFromDataBase", (req, res) => {
    const { index, limit, Id_User } = req.body;
    try {
        connection.query(
            `
                Select  A.*
                From 
                (
                    Select A.Id, A.Title, A.Type, A.CreateAt, A.DeleteAt, B.Id_Platform, B.Platform, C.Url, D.Name, D.UrlPic,
                    IFNULL((
                        Select Count(E.Id_Post)
                        From post_comment E
                        Where Id_Post = A.Id
                        Group by E.Id_Post
                    ),0 )as NumComment,
                    IFNULL((
                        Select Count(F.Id_Post)
                        From post_like F
                        Where Id_Post = A.Id
                        Group by F.Id_Post
                    ),0 )as NumLike,
                    EXISTS (
                        Select 1
                        From post_like G
                        Where G.Id_Post = A.Id AND G.Id_User = ?
                        LIMIT 1 
                    ) AS IsLike
                    From user_post A 
                    Inner join user_account B on A.Id_User = B.Id_Platform
                    Left join post_img C on A.Id = C.Id_Post And C.State = 0
                    Left join user_infor D on A.Id_User = D.Id_User
                    Where A.State = 0    
                    Order by A.CreateAt desc                    
                ) A
                LIMIT ? OFFSET ?
            `,
            [Id_User, limit, index * limit],
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ status: "error" });
                }
                return res.status(200).send({ status: "oke", result: rows });
            }
        );
    } catch (err) {
        return res.status(500).send({ status: "error" });
    }
});

//#region comment
app.post("/updateCommenttoDataBase", (req, res) => {
    const { Id_Post, Id_User, Content, Level } = req.body;
    try {
        connection.query(
            `
                Insert into post_comment (Id_Post, Id_User, Content, Level)
                Values (?,?,?,?)
            `,
            [Id_Post, Id_User, Content, Level],
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ status: "error" });
                }
                return res.status(200).send({ status: "oke", newId: rows.insertId });
            }
        );
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: "error" });
    }
});

app.post("/getCommentFromDataBase", (req, res) => {
    const { Id_Post, Id_User } = req.body;
    try {
        connection.query(
            `
                Select  A.Id, A.Content, A.Level, A.CreateAt, A.Id_Post, A.Id_User,B.Name, B.UrlPic,
                IFNULL((
                    Select Count(B.Id_Comment)
                    From comment_like B
                    Where B.Id_Comment = A.Id
                    Group by B.Id_Comment
                ),0 )as NumLike,
                EXISTS (
                    Select 1
                    From comment_like C
                    Where C.Id_Comment = A.Id AND C.Id_User = ?
                    LIMIT 1 
                ) AS IsLike
                From post_comment  A
                Left join user_infor B on A.Id_User = B.Id_User
                Where A.Id_Post = ?
                Order By A.CreateAt desc
            `,
            [Id_User, Id_Post],
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ status: "error" });
                }
                return res.status(200).send({ status: "oke", result: rows });
            }
        );
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: "error" });
    }
});
//#endregions

app.post("/updateLikeOfPosttoDataBase", (req, res) => {
    const { Id_Post, Id_User } = req.body;
    try {
        connection.query(
            // key = 1 is post, key = 2 is comment
            `
               Call updateLiketoDataBase(?,?,1)  
            `,
            [Id_Post, Id_User],
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

app.post("/updateLikeOfCommenttoDataBase", (req, res) => {
    const { Id_Comment, Id_User } = req.body;
    try {
        connection.query(
            // key = 1 is post, key = 2 is comment
            `
               Call updateLiketoDataBase(?,?,2)
            `,
            [Id_Comment, Id_User],
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

module.exports = app;
