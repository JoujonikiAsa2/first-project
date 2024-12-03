import { Router } from 'express';
import { userRoutes } from '../moduls/user/user.route';
import { studentRoutes } from '../moduls/student/student.route';
import { academicSemesterRoutes } from '../moduls/academicSemester/academicSemester.route';

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
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;