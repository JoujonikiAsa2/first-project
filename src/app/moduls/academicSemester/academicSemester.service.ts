import { academicSemesterNameCodeMapper } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid Semester Code');
  }
  const academicSemester = await AcademicSemester.create(payload);
  return academicSemester;
};

const getAcademicSemestersFromDB = async () => {
  const academicSemesters = await AcademicSemester.find({});
  return academicSemesters;
};

const getAcademicSemesterFromDB = async (id: string) => {
  const academicSemesters = await AcademicSemester.findOne({ _id: id });
  return academicSemesters;
};

const updateAcademicSemesterIntoDB = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new Error('Invalid Semester Code');
  }
  const result = await AcademicSemester.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const AcademicServices = {
  createAcademicSemesterIntoDB,
  getAcademicSemestersFromDB,
  getAcademicSemesterFromDB,
  updateAcademicSemesterIntoDB,
};
