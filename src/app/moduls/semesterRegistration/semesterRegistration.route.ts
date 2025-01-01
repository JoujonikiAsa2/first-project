import { Router } from "express";
import { semesterRegistrationController } from "./semesterRegistration.controller";
import { SemesterRegistrationValidations } from "./semesterRegistration.validation";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
const router = Router();

router.post(
    '/create-semester-registration',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(
      SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
    ),
    semesterRegistrationController.createSemesterRegistration,
  );
  
  router.get(
    '/',
    semesterRegistrationController.getAllSemesterRegistration,
  );
  router.get(
    '/:id',
    semesterRegistrationController.getSingleSemesterRegistration,
  );
  
  router.patch(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(
      SemesterRegistrationValidations.upadateSemesterRegistrationValidationSchema,
    ),
    semesterRegistrationController.updateSemesterRegistration,
  );
  
  router.delete(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    semesterRegistrationController.deleteSemesterRegistration,
  );
  
  

export const semesterRegistrationRoutes = router;