import { Model, Types } from 'mongoose';
import { TUserName } from '../../interface/name';

export type TGender = 'male' | 'female' | 'others';
export type TBloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type TAdmin = {
  id: string;
  designation: string;
  name: TUserName;
  gender: TGender;
  dateOfBirth?: Date;
  email: string;
  user: Types.ObjectId;
  bloodGroup: TBloodGroup;
  contactNo: string;
  emergencyContactNo: string;
  presentAddress: string;
  permanentAddress: string;
  profileImg: string;
  managementDepartment: Types.ObjectId;
  isDeleted: boolean;
};

export interface AdminModel extends Model<TAdmin> {
  isAdminExists(id: string): Promise<TAdmin | null>;
}
