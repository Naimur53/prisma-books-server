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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const createBycryptPassword_1 = __importDefault(require("../../../helpers/createBycryptPassword"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // checking is user buyer
    try {
        const { password: givenPassword } = user, rest = __rest(user, ["password"]);
        const genarateBycryptPass = yield (0, createBycryptPassword_1.default)(givenPassword);
        const newUser = yield prisma_1.default.user.create({
            data: Object.assign({ password: genarateBycryptPass }, rest),
        });
        // eslint-disable-next-line no-unused-vars
        const { password, id, email, name } = newUser, others = __rest(newUser, ["password", "id", "email", "name"]);
        //create access token & refresh token
        const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role: newUser.role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
        const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role: newUser.role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
        return {
            user: Object.assign({ email, id, name }, others),
            accessToken,
            refreshToken,
        };
    }
    catch (err) {
        console.log(err);
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User Already exits ');
    }
    // eslint-disable-next-line no-unused-vars
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email: givenEmail, password } = payload;
    const isUserExist = yield prisma_1.default.user.findFirst({
        where: { email: givenEmail },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    if (isUserExist.password &&
        !(yield bcrypt_1.default.compare(password, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect');
    }
    //create access token & refresh token
    const { email, id, role, name } = isUserExist, others = __rest(isUserExist, ["email", "id", "role", "name"]);
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        user: Object.assign({ email, id, name, role }, others),
        accessToken,
        refreshToken,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    //verify token
    // invalid token - synchronous
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh Token');
    }
    const { id } = verifiedToken;
    // checking deleted user's refresh token
    const isUserExist = yield prisma_1.default.user.findFirst({ where: { id } });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    //generate new Access token
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({
        userId: isUserExist.id,
        role: isUserExist.role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken: newAccessToken,
    };
});
exports.AuthService = {
    createUser,
    loginUser,
    refreshToken,
};
