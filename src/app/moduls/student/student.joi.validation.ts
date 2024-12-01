import Joi from 'joi';

//creating a schema validation using joi
// Username Schema
const userNameSchema = Joi.object({
  firstName: Joi.string()
    .max(20)
    .regex(/^[A-Z][a-z]*$/, 'First Name should start with a capital letter')
    .required(),
  middleName: Joi.string().max(20).allow('', null),
  lastName: Joi.string()
    .regex(/^[a-zA-Z]+$/, 'Last Name must contain only letters')
    .required(),
});

// Guardian Schema
const guardianSchema = Joi.object({
  fatherName: Joi.string().required(),
  fatherOccupation: Joi.string().required(),
  fatherContactNo: Joi.string().required(),
  motherName: Joi.string().required(),
  motherOccupation: Joi.string().required(),
  motherContactNo: Joi.string().required(),
});

// Local Guardian Schema
const localGuardianSchema = Joi.object({
  name: Joi.string().required(),
  occupation: Joi.string().required(),
  contactNo: Joi.string().required(),
  address: Joi.string().required(),
});

// Main Student Schema
const studentSchema = Joi.object({
  id: Joi.string().required(),
  name: userNameSchema.required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  dateOfBirth: Joi.string().optional(),
  email: Joi.string().email().required(),
  contactNo: Joi.string().required(),
  emergencyContactNo: Joi.string().required(),
  bloodGroup: Joi.string().valid(
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-',
  ),
  presentAddress: Joi.string().required(),
  permanentAddress: Joi.string().required(),
  guardian: guardianSchema.required(),
  localGuardian: localGuardianSchema.required(),
  profileImg: Joi.string(),
  isActive: Joi.string().uri().valid('active', 'blocked').default('active'),
});

export default studentSchema 
