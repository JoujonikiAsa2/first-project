export const USER_ROLE = {
  student: 'student',
  faculty: 'faculty',
  admin: 'admin',
  superAdmin: "superAdmin"
} as const;

export type TUserRole = keyof typeof USER_ROLE;
