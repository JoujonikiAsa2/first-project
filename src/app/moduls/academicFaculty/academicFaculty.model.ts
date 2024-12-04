import { model, Schema } from "mongoose";
import { TAcademicFaculty } from "./academicFaculty.interface";

const academicFacultySchema = new Schema<TAcademicFaculty>({
    name: {
        type: String,
        required: true,
        unique: true
    }
},{
    timestamps: true
})

academicFacultySchema.pre('findOneAndUpdate',async function (next) {
    const query = this.getQuery()
    const isDepertmentExist = await AcademicFaculty.findOne({
        query
    })
    if(!isDepertmentExist){
        throw new Error('Faculty does not exist')
    }
    next()
})

const AcademicFaculty = model<TAcademicFaculty>('AcademicFaculty', academicFacultySchema)
export default AcademicFaculty