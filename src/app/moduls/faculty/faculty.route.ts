import { Router } from 'express';
import { facultyControllers } from './faculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { updateFacultyValidationSchema } from './faculty.validation';
const router = Router();

router.get('/', facultyControllers.getAllFaculty);
router.get('/:id', facultyControllers.getSignleFaculty);
router.patch(
  '/:id',
  validateRequest(updateFacultyValidationSchema),
  facultyControllers.updateSingleFaculty,
);
router.delete('/:id', facultyControllers.deleteSingleFaculty);

export const facultyRoutes = router;
