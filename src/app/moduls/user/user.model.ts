import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import { TUser, UserModel } from './user.interface';
const userSchema = new Schema<TUser>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    passwordChangedAt: {
      type: Date,
    },

    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'admin'],
      required: true,
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

//static method for checking if user is exists
userSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await User.findOne({ id: id }).select('+password');
  return existingUser;
};

//static method for checking if user is deleted
userSchema.statics.isDeleted = async function (id: string) {
  const isUserDeleted = await User.findOne({ id: id, isDeleted: true });
  return isUserDeleted;
};

//static method for checking if user is blocked
userSchema.statics.isBlocked = async function (id: string) {
  const isUserBlocked = await User.findOne({ id: id, status: 'blocked' });
  return isUserBlocked;
};
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  // hashing password and save into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// set '' after saving password
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isPasswordMatch = async function (
  password: string,
  hashPassword: string,
) {
  return bcrypt.compare(password, hashPassword);
};

userSchema.statics.isJWTIssuedBefforePasswordChanged = async function (
  passwordChangedTimestamp: Date,
  JWTIssuedTimestamp: number,
) {
  const passwordChangedTime = new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > JWTIssuedTimestamp;
};

export const User = model<TUser, UserModel>('User', userSchema);
