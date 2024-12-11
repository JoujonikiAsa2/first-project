import { Router } from 'express';
import { adminControllers } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { updateAdminValidationSchema } from './admin.validation';
const router = Router();

router.get('/', adminControllers.getAllAdmin);
router.get('/:id', adminControllers.getSingleAdmin);
router.patch('/:id', validateRequest(updateAdminValidationSchema) , adminControllers.updateSingleAdmin);
router.delete('/:id', adminControllers.deleteSingleAdmin);

export const adminRoutes = router;
