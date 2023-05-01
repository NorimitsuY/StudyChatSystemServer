import https from "https";
import express from "express";
import fs from "fs";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

const cors = require('cors');

const app:express.Express = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({
    extended:true
})
);

//本番時は直す
app.use(cors({
    origin: 'https://localhost:3000', //アクセス許可するオリジン
    credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
    optionsSuccessStatus: 200 //レスポンスstatusを200に設定
}));

//mongoose関連
mongoose.Promise = global.Promise;
mongoose.connect(
    "mongodb://127.0.0.1:27017/chatsystem"
);
const db = mongoose.connection;
db.once("open",() => {
    console.log("Successfully connected to MongoDB using Mongoose");
});

import router from "./routes/indexRoutes";
app.use("/api",router);
let options = {
    "key":fs.readFileSync('./cert/server_key.pem'),
    "cert":fs.readFileSync('./cert/server_crt.pem')
};


const server = https.createServer(options,app);
server.listen(8080);
