import { Schema } from 'mongoose';

export type TAcademicDepartment = {
  name: string;
  academicFaculty: Schema.Types.ObjectId;
};
