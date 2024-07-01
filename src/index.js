const express = require("express");
const app = express();
const port = 3000;
app.use(express.json()); //body-parser

//my sql
const connection = require("./services/index");
connection.connect();
//routes
const infor = require("./routes/infor");
const event = require("./routes/event.js");
app.use("/api/infor", infor);
app.use("/api/event", event);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
