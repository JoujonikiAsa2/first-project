import { Router } from 'express';
import { userRoutes } from '../moduls/user/user.route';
import { studentRoutes } from '../moduls/student/student.route';
import { academicSemesterRoutes } from '../moduls/academicSemester/academicSemester.route';
import { academicFacultyRoutes } from '../moduls/academicFaculty/academicFaculty.route';
import { academicDepartmentRoutes } from '../moduls/academicDepartment/academicDepartment.route';
import { facultyRoutes } from '../moduls/faculty/faculty.route';
import { adminRoutes } from '../moduls/admin/admin.route';
import { courseRoutes } from '../moduls/course/course.route';
import { semesterRegistrationRoutes } from '../moduls/semesterRegistration/semesterRegistration.route';
import { offeredCourseRoutes } from '../moduls/offeredCourse/offeredCourse.route';
import { authRoutes } from '../moduls/auth/auth.route';
import { enrolledCourse } from '../moduls/enrolledCourse/enrolledCourse.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/students',
    route: studentRoutes,
  },
  {
    path: '/academic-semesters',
    route: academicSemesterRoutes,
  },
  {
    path: '/academic-faculties',
    route: academicFacultyRoutes,
  },
  {
    path: '/academic-departments',
    route: academicDepartmentRoutes
  },
  {
    path: '/faculties',
    route: facultyRoutes
  },
  {
    path: '/admins',
    route: adminRoutes
  },
  {
    path: '/courses',
    route: courseRoutes
  },
  {
    path: '/semester-registrations',
    route: semesterRegistrationRoutes
  },
  {
    path: '/offered-courses',
    route: offeredCourseRoutes,
  },
  {
    path: '/auth',
    route: authRoutes
  },
  {
    path: '/enrolled-courses',
    route: enrolledCourse
  }

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;