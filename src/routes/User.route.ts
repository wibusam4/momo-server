import express from "express";
import UserController from "../controller/User.controller";
const routerUser = express.Router();

routerUser.post("/register", UserController.register);
routerUser.post("/login", UserController.login);
routerUser.post("/momo", UserController.momo);

export default routerUser;