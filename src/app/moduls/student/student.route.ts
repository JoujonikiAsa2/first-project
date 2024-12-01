import express from "express";
import { studentControllers } from "./student.controller";

const router = express.Router();

///router will call controller function
router.get('/', studentControllers.getAllStudent)
router.get('/:id', studentControllers.getSingleStudent)
router.delete('/:id', studentControllers.deleteStudent)

export const studentRoutes = router