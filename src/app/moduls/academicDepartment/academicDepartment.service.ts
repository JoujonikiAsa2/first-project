import { TAcademicDepartment } from './academicDepartment.interface';
import AcademicDepartment from './academicDepartment.model';
import QueryBuilder from '../../builder/QueryBuilder';
import AcademicFaculty from '../academicFaculty/academicFaculty.model';

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  //check if the academic faculty is exist
  const isAcademicFacultyExist = await AcademicFaculty.findById(
    payload.academicFaculty,
  );
  if (!isAcademicFacultyExist) {
    throw new Error('Academic Faculty not found');
  }
  const result = await AcademicDepartment.create(payload);
  return result;
};

const getAllAcademicDepartmentFromDB = async (
  query: Record<string, unknown>,
) => {
  const academicFacultyQuery = new QueryBuilder(
    AcademicDepartment.find().populate('academicFaculty'),
    query,
  )
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await academicFacultyQuery.modelQuery;
  const meta = await academicFacultyQuery.count();
  return { meta, result };
};

const updateAcademicDepartmentIntoDB = async (
  id: string,
  payload: Partial<TAcademicDepartment>,
) => {
  const result = await AcademicDepartment.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    },
  );
  return result;
};

export const AcademicDepartmentServices = {
  createAcademicDepartmentIntoDB,
  getAllAcademicDepartmentFromDB,
  updateAcademicDepartmentIntoDB,
};
