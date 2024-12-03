import { model, Schema } from "mongoose";
import { TAcademicDepartment } from "./academicDepartment.interface";

const academicDepartmentSchema = new Schema<TAcademicDepartment>({
    name:{
        type: String,
        required: true,
        unique: true
    },
    academicFaculty: {
        type: Schema.Types.ObjectId,
        ref: 'AcademicFaculty',
        required: true
    }
},{
    timestamps: true
})

const AcademicDepartment = model<TAcademicDepartment>('AcademicDepartment', academicDepartmentSchema)
export default AcademicDepartment