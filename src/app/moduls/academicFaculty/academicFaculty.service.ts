import { TAcademicFaculty } from "./academicFaculty.interface";
import AcademicFaculty from "./academicFaculty.model";

const createAcademicFacultyIntoDB = (payload: TAcademicFaculty) => {
    return AcademicFaculty.create(payload);
}

const getAcademicFacultyFromDB = () =>{
    return AcademicFaculty.find()
}

const getSingleAcademicFacultyFromDB = (id: string) =>{
    return AcademicFaculty.findById(id)
}


const updateAcademicFacultyIntoDB = (id: string, payload: Partial<TAcademicFaculty>) => {
    return AcademicFaculty.findOneAndUpdate({ _id: id }, payload, { new: true })
}
export const academicFacultyServices = {
    createAcademicFacultyIntoDB,
    getAcademicFacultyFromDB,
    getSingleAcademicFacultyFromDB,
    updateAcademicFacultyIntoDB
}