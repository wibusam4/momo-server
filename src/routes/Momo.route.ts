import express from "express";
import MomoController from "../controller/Momo.Controller";
const routerMomo = express.Router();

routerMomo.post("/", MomoController.add);

export default routerMomo;