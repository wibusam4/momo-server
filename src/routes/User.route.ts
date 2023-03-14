import express from "express";
import UserController from "../controller/User.controller";
import MomoController from "../controller/Momo.controller";
const routerUser = express.Router();

routerUser.post("/register", UserController.register);
routerUser.post("/login", UserController.login);
routerUser.post("/momo", MomoController.add);

export default routerUser;