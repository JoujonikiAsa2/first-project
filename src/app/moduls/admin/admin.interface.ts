import { Model, Types } from 'mongoose';

export type TGender = 'male' | 'female' | 'others';
export type TBloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type TAdmin = {
  id: string;
  designation: string;
  name: string;
  gender: TGender;
  dateOfBirth?: Date;
  email: string;
  user: Types.ObjectId;
  bloodGroup: TBloodGroup;
  contactNo: string;
  emergencyContactNo: string;
  presentAddress: string;
  permanentAddress: string;
  profileImage: string;
  managementDepartment: Types.ObjectId;
  isDeleted: boolean;
};

export interface AdminModel extends Model<TAdmin> {
  isAdminExists(id: string): Promise<TAdmin | null>;
}
