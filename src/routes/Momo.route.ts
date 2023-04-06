import express from "express";
import MomoController from "../controller/Momo.controller";
const routerMomo = express.Router();

routerMomo.post("/", MomoController.addMomo);

export default routerMomo;