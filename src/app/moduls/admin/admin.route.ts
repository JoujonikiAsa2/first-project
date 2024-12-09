import { Router } from 'express';
import { adminControllers } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { updateAdminValidationSchema } from './admin.validation';
const router = Router();

router.get('/', adminControllers.getAdmin);
router.get('/:adminId', adminControllers.getSingleAdmin);
router.patch('/:adminId', validateRequest(updateAdminValidationSchema) , adminControllers.updateSingleAdmin);
router.delete('/:adminId', adminControllers.deleteSingleAdmin);

export const adminRoutes = router;
