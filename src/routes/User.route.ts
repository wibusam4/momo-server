import express from "express";
import UserController from "../controller/User.controller";
import MomoController from "../controller/Momo.controller";
import isLogin from "../middleware/isLogin";
const routerUser = express.Router();

routerUser.post("/register", UserController.register);
routerUser.post("/login", UserController.login);
routerUser.post("/momo", isLogin, MomoController.add);
routerUser.get("/momo", isLogin, MomoController.get);
routerUser.put("/momo", isLogin, MomoController.delete);
routerUser.get("/infor", isLogin, UserController.getInfor);

export default routerUser;
