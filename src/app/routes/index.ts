import { Router } from 'express';
import { userRoutes } from '../moduls/user/user.route';
import { studentRoutes } from '../moduls/student/student.route';
import { academicSemesterRoutes } from '../moduls/academicSemester/academicSemester.route';
import { academicFacultyRoutes } from '../moduls/academicFaculty/academicFaculty.route';
import { academicDepartmentRoutes } from '../moduls/academicDepartment/academicDepartment.route';

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
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;