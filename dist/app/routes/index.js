"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../moduls/user/user.route");
const student_route_1 = require("../moduls/student/student.route");
const academicSemester_route_1 = require("../moduls/academicSemester/academicSemester.route");
const academicFaculty_route_1 = require("../moduls/academicFaculty/academicFaculty.route");
const academicDepartment_route_1 = require("../moduls/academicDepartment/academicDepartment.route");
const faculty_route_1 = require("../moduls/faculty/faculty.route");
const admin_route_1 = require("../moduls/admin/admin.route");
const course_route_1 = require("../moduls/course/course.route");
const semesterRegistration_route_1 = require("../moduls/semesterRegistration/semesterRegistration.route");
const offeredCourse_route_1 = require("../moduls/offeredCourse/offeredCourse.route");
const auth_route_1 = require("../moduls/auth/auth.route");
const enrolledCourse_route_1 = require("../moduls/enrolledCourse/enrolledCourse.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/users',
        route: user_route_1.userRoutes,
    },
    {
        path: '/students',
        route: student_route_1.studentRoutes,
    },
    {
        path: '/academic-semesters',
        route: academicSemester_route_1.academicSemesterRoutes,
    },
    {
        path: '/academic-faculties',
        route: academicFaculty_route_1.academicFacultyRoutes,
    },
    {
        path: '/academic-departments',
        route: academicDepartment_route_1.academicDepartmentRoutes
    },
    {
        path: '/faculties',
        route: faculty_route_1.facultyRoutes
    },
    {
        path: '/admins',
        route: admin_route_1.adminRoutes
    },
    {
        path: '/courses',
        route: course_route_1.courseRoutes
    },
    {
        path: '/semester-registrations',
        route: semesterRegistration_route_1.semesterRegistrationRoutes
    },
    {
        path: '/offered-courses',
        route: offeredCourse_route_1.offeredCourseRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.authRoutes
    },
    {
        path: '/enrolled-courses',
        route: enrolledCourse_route_1.enrolledCourse
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
