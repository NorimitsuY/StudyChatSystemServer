import express from "express";
import {User} from "../controllers/userController";
import {Auth} from "../common/auth/auth";

const router = express.Router();

const user = new User();
const auth = new Auth();

router.get("/getalluser", auth.isAdminAuth, user.getAllUsers);
router.post("/login", user.login);
router.post("/adduser",user.AddUser);
router.get("/logincheck", auth.isAuth, user.loginCheck);
router.get("/getloginuserinfo", auth.getLoginUserInfo, user.getLoginUserInfo);
router.post("/logout", user.logout);

export = router;