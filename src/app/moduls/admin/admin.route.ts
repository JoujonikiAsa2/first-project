import { Router } from 'express';
import { adminControllers } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { updateAdminValidationSchema } from './admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
const router = Router();

router.get('/', auth(USER_ROLE.superAdmin), adminControllers.getAllAdmin);
router.get('/:id', auth(USER_ROLE.superAdmin), adminControllers.getSingleAdmin);
router.patch('/:id', auth(USER_ROLE.superAdmin), validateRequest(updateAdminValidationSchema) , adminControllers.updateSingleAdmin);
router.delete('/:id', auth(USER_ROLE.superAdmin), adminControllers.deleteSingleAdmin);

export const adminRoutes = router;
