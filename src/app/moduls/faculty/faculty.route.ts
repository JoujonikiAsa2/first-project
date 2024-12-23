import { Router } from 'express';
import { facultyControllers } from './faculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { updateFacultyValidationSchema } from './faculty.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
const router = Router();

router.get('/', auth(USER_ROLE.admin, USER_ROLE.faculty), facultyControllers.getAllFaculty);
router.get('/:id', facultyControllers.getSignleFaculty);
router.patch(
  '/:id',
  validateRequest(updateFacultyValidationSchema),
  facultyControllers.updateSingleFaculty,
);
router.delete('/:id', facultyControllers.deleteSingleFaculty);

export const facultyRoutes = router;
