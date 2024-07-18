const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");
app.use(cors());
app.use(express.json()); //body-parser

//my sql
const connection = require("./services/index");
connection.connect();
//routes
const infor = require("./routes/infor");
const event = require("./routes/event.js");
const user = require("./routes/user.js");
const post = require("./routes/post.js");
const dev = require("./routes/dev.js");
const admin = require("./routes/admin.js");
app.use("/api/infor", infor);
app.use("/api/event", event);
app.use("/api/user", user);
app.use("/api/post", post);
app.use("/api/dev", dev);
app.use("/api/admin", admin);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
