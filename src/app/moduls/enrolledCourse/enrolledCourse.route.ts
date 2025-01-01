import { Router } from "express"
import { enrolledCourseControllers } from "./enrolledCourse.controller"
import auth from "../../middlewares/auth"
import { USER_ROLE } from "../user/user.constant"

const router = Router()

router.post('/create-enrolled-course', auth(USER_ROLE.student), enrolledCourseControllers.createEnrolledCourse )
router.patch('/update-course-marks', auth(USER_ROLE.faculty, USER_ROLE.admin, USER_ROLE.superAdmin), enrolledCourseControllers.updateCourseMarks )
router.get('/my-enrolled-courses', auth(USER_ROLE.student), enrolledCourseControllers.getMyEnrolledCourses )
router.get('/:id', auth(USER_ROLE.student), enrolledCourseControllers.getSingleEnrolledCourse )

export const enrolledCourse = router