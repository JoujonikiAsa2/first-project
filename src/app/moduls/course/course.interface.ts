import { Model, Types } from "mongoose"

export type TPreRequisite = {
    course: Types.ObjectId,
    isDeleted:boolean
}
export type TCourse = {
    prefix: string,
    code: string,
    title: string,
    credit: number,
    preRequisiteCourses: [TPreRequisite],
    isDeleted: boolean
}

export type TCourseFaculty = {
    course: Types.ObjectId,
    faculties: [Types.ObjectId]
}

export interface CourseModel extends Model<TCourse> {
    isCourseExists(id:string): Promise<TCourse | null>
} 