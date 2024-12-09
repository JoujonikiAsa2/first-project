import { Router } from 'express';
import { facultyControllers } from './faculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { updateFacultyValidationSchema } from './faculty.validation';
const router = Router();

router.get('/', facultyControllers.getFaculty);
router.get('/:facultyId', facultyControllers.getSignleFaculty);
router.patch(
  '/:facultyId',
  validateRequest(updateFacultyValidationSchema),
  facultyControllers.updateSingleFaculty,
);
router.delete('/:facultyId', facultyControllers.deleteSingleFaculty);

export const facultyRoutes = router;
