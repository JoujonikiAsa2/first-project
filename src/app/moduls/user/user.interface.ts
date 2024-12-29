import { Model } from 'mongoose';

export type TUser = {
  id: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
};

export interface UserModel extends Model<TUser> {
  isUserExists(id: string): Promise<TUser | null>;
  isPasswordMatch(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isDeleted(is: string): Promise<TUser | null>;
  isBlocked(is: string): Promise<TUser | null>;
  isJWTIssuedBefforePasswordChanged(passwordChangedTimestamp: Date, JWTIssuedTimestamp: number): Promise<boolean>;
}
