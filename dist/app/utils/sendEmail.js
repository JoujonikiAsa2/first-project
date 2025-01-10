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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const sendEmail = (email, resetURLlink) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: config_1.default.NODE_ENV === 'production', // true for port 465, false for other ports
        auth: {
            user: "joujonikiasaroy@gmail.com",
            pass: "ktcj hqxa pody hjam",
        },
    });
    yield transporter.sendMail({
        from: 'joujonikiasaroy@gmail.com', // sender address
        to: email, // list of receivers
        subject: "Reset your password within 10 minutes", // Subject line
        text: "If you tried to change your password then click on this link otherwise ignore", // plain text body
        html: `<b>${resetURLlink}</b>`, // html body
    });
});
exports.sendEmail = sendEmail;
