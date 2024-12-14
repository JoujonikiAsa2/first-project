import { Router } from "express";
import { semesterRegistrationController } from "./semesterRegistration.controller";
import { SemesterRegistrationValidations } from "./semesterRegistration.validation";
import validateRequest from "../../middlewares/validateRequest";
const router = Router();

router.post(
    '/create-semester-registration',
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
    validateRequest(
      SemesterRegistrationValidations.upadateSemesterRegistrationValidationSchema,
    ),
    semesterRegistrationController.updateSemesterRegistration,
  );
  
  router.delete(
    '/:id',
    semesterRegistrationController.deleteSemesterRegistration,
  );
  
  

export const semesterRegistrationRoutes = router;