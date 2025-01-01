import express from 'express';
import { academicFacultyControllers } from './academicFaculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { academicFacultySchemaValidation } from './academicFaculty.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
const router = express.Router();
router.post(
  '/create-academic-faculty',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(academicFacultySchemaValidation.academicFacultySchema),
  academicFacultyControllers.createAcademicFaculty,
);
router.get('/', academicFacultyControllers.getAcademicFaculty);
router.get('/:id', academicFacultyControllers.getSigngleAcademicFaculty);
router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(academicFacultySchemaValidation.updateAcademicFacultySchema),
  academicFacultyControllers.updateAcademicFaculty,
);
export const academicFacultyRoutes = router;
