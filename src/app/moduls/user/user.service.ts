import config from '../../config';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  //------------insctance method---------------------
  // const studentInstance = new Student(student); //create an instance
  // if (await studentInstance.isUserExists) {
  //   throw new Error('User already exist');
  // }
  // const result = await studentInstance.save();
  // ---------------------------------------------------

  //set student role
  const userData: Partial<TUser> = {};

  //default password if not provided
  userData.password = password || (config.default_pass as string);

  userData.role = 'student';

  userData.id = '2030100001';

  //static method
  if (await Student.isUserExists(studentData.id)) {
    throw new Error('User already exist');
  }
  
  const newUser = await User.create(userData);

  if( Object.keys(newUser).length){
    studentData.id = newUser.id //embed user id
    studentData.user = newUser._id // reference to user id

    const newStudent = await Student.create(studentData);
    return newStudent
  }
};

export const UserService = {
  createStudentIntoDB,
};
