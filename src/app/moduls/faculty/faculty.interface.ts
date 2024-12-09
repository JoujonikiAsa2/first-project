import { Model, Types } from 'mongoose';

export type TFaculty = {
  id: string;
  designation:
    | 'lecturer'
    | 'sr. lecturer'
    | 'professor'
    | 'assistant professor'
    | 'associate professor'
    | 'teaching assistant'
    | 'researcher'
    | 'department head'
    | 'dean'
    | 'administrative staff'
    | 'visiting faculty'
    | 'postdoctoral fellow';
  name: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: Date;
  email: string;
  user: Types.ObjectId;
  contactNo: string;
  emergencyContactNo: string;
  presentAddress: string;
  permanentAddress: string;
  profileImage: string;
  academicFaculty: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  isDeleted: boolean;
};

export interface FacultyModel extends Model<TFaculty> {
  isFacultyExists(id: string): Promise<TFaculty | null>;
}
