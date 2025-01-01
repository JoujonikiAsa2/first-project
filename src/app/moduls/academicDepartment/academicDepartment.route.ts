import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { academicDepartmentSchemaValidations } from './academicDepartment.validation';
import { academicDepartmentControllers } from './academicDepartment.controller';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewares/auth';
const router = express.Router();
router.post(
  '/create-academic-department',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(academicDepartmentSchemaValidations.academicDepartmentSchema),
  academicDepartmentControllers.createAcademicDepartment,
);
router.get('/', academicDepartmentControllers.getAllAcademicDepartment);
router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    academicDepartmentSchemaValidations.updateAcademicDepartmentSchema,
  ),
  academicDepartmentControllers.updateAcademicDepartment,
);
export const academicDepartmentRoutes = router;
