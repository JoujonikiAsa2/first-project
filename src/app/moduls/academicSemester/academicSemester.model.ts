import { model, Schema } from "mongoose";
import { AcademicSemesterCode, AcademicSemesterName, Months } from "./academicSemester.constant";
import { TAcademicSemester } from "./academicSemester.interface";

const academiSemesterSchema = new Schema<TAcademicSemester>({
    name:{
        type: String,
        required: true,
        enum: AcademicSemesterName,
    },
    code: {
        type: String,
        required: true,
        enum: AcademicSemesterCode,
    },
    year: {
        type: String,
        required: true,
    },
    startMonth: {
        type: String,
        required: true,
        enum: Months,
    },
    endMonth: {
        type: String,
        required: true,
        enum: Months
    }
},
{
    timestamps: true,
});

academiSemesterSchema.pre('save', async function (next) {
    const isSemesterExists = await AcademicSemester.findOne({
        year: this.year,
        name: this.name,
    });
    if (isSemesterExists) {
        throw new Error('Semester already exists');
    }
    next();
});

export const AcademicSemester = model<TAcademicSemester>(
    'AcademicSemester',
    academiSemesterSchema,
  );