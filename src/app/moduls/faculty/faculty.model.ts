import { model, Schema, Types } from 'mongoose';
import { FacultyModel, TFaculty } from './faculty.interface';
import { TUserName } from '../../interface/name';
import validator from 'validator';
import { BloodGroup, Gender } from './fauclty.constant';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    // required: [true, 'First Name is required'],
    trim: true,
    maxlength: [20, 'Name can not be more than 20 characters'],
    validate: {
      validator: function (value: string) {
        const firstName = value.charAt(0).toUpperCase() + value.slice(1);
        return firstName === value;
      },
      message: '{VALUE} is not in capital format',
    },
  },
  middleName: {
    type: String,
    trim: true,
    maxlength: [20, 'Name can not be more than 20 characters'],
  },
  lastName: {
    type: String,
    maxlength: [20, 'Name can not be more than 20 characters'],
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: '{VALUE} is not a valid last name',
    },
  },
});

const facultySchema = new Schema(
  {
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true,
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
    },
    name: userNameSchema,
    gender: {
      type: String,
      enum: {
        values: Gender,
        message: '{VALUE} is not a valid gender',
      },
      required: [true, 'Gender is required'],
    },
    dateOfBirth: { type: Date },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: '{VALUE} is not a valid email',
      },
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User id is required'],
      unique: true,
      ref: 'User',
    },
    bloodGroup: {
      type: String,
      enum: {
        values: BloodGroup,
        message: '{VALUE} is not a valid blood group',
      },
    },
    contactNo: {
      type: String,
      required: [true, 'Contact number is required'],
    },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency contact number is required'],
    },
    presentAddress: {
      type: String,
      required: [true, 'Present address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required'],
    },
    profileImg: { type: String, default:""},
    academicDepartment: Types.ObjectId,
    academicFaculty: Types.ObjectId,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

//provide a virtual property fullname
facultySchema.virtual('fullName').get(function () {
  return (
    `${this.name?.firstName} ${this.name?.middleName} ${this.name?.lastName}`
  )
});

//find faculty by id
facultySchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

//for aggregation
facultySchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

facultySchema.statics.isFacultyExists = async function (id: string) {
  const existingFaculty = await Faculty.findOne({ id: id, isDeleted: false });
  return existingFaculty;
};

const Faculty = model<TFaculty, FacultyModel>('Faculty', facultySchema);
export default Faculty;
