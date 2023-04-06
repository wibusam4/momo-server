import express from "express";
import UserController from "../controller/User.controller";
import MomoController from "../controller/Momo.controller";
import isLogin from "../middleware/isLogin";
const routerUser = express.Router();

routerUser.post("/register", UserController.register);
routerUser.post("/login", UserController.login);
routerUser.post("/momo", isLogin, MomoController.addMomo);
routerUser.get("/momo", isLogin, MomoController.getMomoByUserId);
routerUser.delete("/momo", isLogin, MomoController.deleteMomoById);
routerUser.get("/infor", isLogin, UserController.getInforUser);

export default routerUser;
