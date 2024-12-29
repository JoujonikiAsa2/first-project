import express, { NextFunction, Request, Response } from 'express';
import { userControllers } from './user.controller';
import { createFacultyValidationSchema } from '../faculty/faculty.validation';
import validateRequest from '../../middlewares/validateRequest';
import { createStudentValidationSchema } from '../student/student.validation';
import { createAdminValidationSchema } from '../admin/admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { upload } from '../../utils/sendImageToCloudinary';
const router = express.Router();

router.post(
  '/create-student',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth(USER_ROLE.admin),
  validateRequest(createStudentValidationSchema),
  userControllers.createStudent,
);
router.post(
  '/create-faculty',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth(USER_ROLE.admin),
  validateRequest(createFacultyValidationSchema),
  userControllers.createFaculty,
);
router.post(
  '/create-admin',
  // auth(USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createAdminValidationSchema),
  userControllers.createAdmin,
);
router.get('/', auth(USER_ROLE.admin), userControllers.getAllStudent);

router.get(
  '/me',
  auth(USER_ROLE.student, USER_ROLE.faculty, USER_ROLE.admin),
  userControllers.getMe,
);
router.get(
  '/change-status/:id',
  auth(USER_ROLE.student, USER_ROLE.faculty, USER_ROLE.admin),
  userControllers.changeStatus,
);

export const userRoutes = router;
