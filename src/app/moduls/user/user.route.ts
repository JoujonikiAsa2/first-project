import express from 'express';
import { userControllers } from './user.controller';
import { createFacultyValidationSchema } from '../faculty/faculty.validation';
import validateRequest from '../../middlewares/validateRequest';
import { createStudentValidationSchema } from '../student/student.validation';
import { createAdminValidationSchema } from '../admin/admin.validation';
const router = express.Router();

router.post(
  '/create-student',
  validateRequest(createStudentValidationSchema),
  userControllers.createStudent,
);
router.post(
  '/create-faculty',
  validateRequest(createFacultyValidationSchema),
  userControllers.createFaculty,
);
router.post(
  '/create-admin',
  validateRequest(createAdminValidationSchema),
  userControllers.createAdmin,
);
router.get('/', userControllers.getAllStudent);

export const userRoutes = router;
