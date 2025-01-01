import { model, Schema } from "mongoose";
import { TAcademicDepartment } from "./academicDepartment.interface";
import AppError from "../../errors/AppError";
import httpStatus from 'http-status';

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

academicDepartmentSchema.pre('save', async function (next) {
    const isDepertmentExist = await AcademicDepartment.findOne({
        name: this.name
    })
    if(isDepertmentExist){
        throw new Error('Depertment already exist')
    }
    next()
})

academicDepartmentSchema.pre('findOneAndUpdate',async function (next) {
    const query = this.getQuery()
    const isDepertmentExist = await AcademicDepartment.findOne({
        query
    })
    if(!isDepertmentExist){
        throw new AppError(
            'Department not found',
            httpStatus.NOT_FOUND,
          );
    }
    next()
})

const AcademicDepartment = model<TAcademicDepartment>('AcademicDepartment', academicDepartmentSchema)
export default AcademicDepartment