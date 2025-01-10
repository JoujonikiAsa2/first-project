"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const fauclty_constant_1 = require("./fauclty.constant");
const userNameSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        // required: [true, 'First Name is required'],
        trim: true,
        maxlength: [20, 'Name can not be more than 20 characters'],
        validate: {
            validator: function (value) {
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
            validator: (value) => validator_1.default.isAlpha(value),
            message: '{VALUE} is not a valid last name',
        },
    },
});
const facultySchema = new mongoose_1.Schema({
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
            values: fauclty_constant_1.Gender,
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
            validator: (value) => validator_1.default.isEmail(value),
            message: '{VALUE} is not a valid email',
        },
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'User id is required'],
        unique: true,
        ref: 'User',
    },
    bloodGroup: {
        type: String,
        enum: {
            values: fauclty_constant_1.BloodGroup,
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
    profileImg: { type: String, default: "" },
    academicDepartment: mongoose_1.Types.ObjectId,
    academicFaculty: mongoose_1.Types.ObjectId,
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
//provide a virtual property fullname
facultySchema.virtual('fullName').get(function () {
    var _a, _b, _c;
    return (`${(_a = this.name) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = this.name) === null || _b === void 0 ? void 0 : _b.middleName} ${(_c = this.name) === null || _c === void 0 ? void 0 : _c.lastName}`);
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
facultySchema.statics.isFacultyExists = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingFaculty = yield Faculty.findOne({ id: id, isDeleted: false });
        return existingFaculty;
    });
};
const Faculty = (0, mongoose_1.model)('Faculty', facultySchema);
exports.default = Faculty;
