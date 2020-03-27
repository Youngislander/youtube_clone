import "@babel/polyfill";
import express from "express";
import back from "express-back";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import passport from "passport";
import { localsMiddleware } from "./middlewares";
import mongoose from "mongoose";
import session from "express-session";
import path from "path";
import cookieParser from "cookie-parser";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import apiRouter from "./routers/apiRouter.js"
import routes from "./routes";
import MongoStore from "connect-mongo";
import "./passport";

const app = express();

const CokieStore = MongoStore(session);

console.log(process.env.COOKIE_SECRET);

app.use(helmet());
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use("/static", express.static(path.join(__dirname, "static")));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true}));
app.use(morgan("dev"));
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new CokieStore({mongooseConnection: mongoose.connection}) 
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(session({
    secret: 'super secret'
  }));
app.use(back());


app.use(localsMiddleware);

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter); 
app.use(routes.api, apiRouter);

export default app;