import config from '../../config';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { AcademicSemester } from './../academicSemester/academicSemester.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import generateStudentId from './user.utils';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // Create a user object
  const userData: Partial<TUser> = {};

  // If password is not provided, use default password
  userData.password = password || (config.default_pass as string);

  // Set student role
  userData.role = 'student';

  // Find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  if (!admissionSemester) {
    throw new Error('Invalid admission semester');
  }

  // Set generated ID
  userData.id = await generateStudentId(admissionSemester);

  const isStudentExist = await Student.findOne({ email: payload.email });
  if (isStudentExist) {
    throw new Error('User already exists');
  } else {
    const newUser = await User.create(userData);

    // Set IDs for student
    payload.id = newUser.id; // `newUser` is an array because of the `create` method with session
    payload.user = newUser._id; // Reference user `_id`

    // Create a student
    await Student.create(payload);

    return newUser;
  }
};

export const UserServices = {
  createStudentIntoDB,
};
