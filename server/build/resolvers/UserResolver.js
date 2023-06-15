"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_errors_1 = require("apollo-server-errors");
const type_graphql_1 = require("type-graphql");
const db_1 = __importDefault(require("../db"));
const User_1 = __importStar(require("../entity/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../env");
const expo_server_sdk_1 = require("expo-server-sdk");
const expo = new expo_server_sdk_1.Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
let UserResolver = class UserResolver {
    async createUser({ email, password }) {
        const exisitingUser = await db_1.default
            .getRepository(User_1.default)
            .findOne({ where: { email } });
        if (exisitingUser !== null)
            throw new apollo_server_errors_1.ApolloError("EMAIL_ALREADY_EXISTS");
        const hashedPassword = await (0, User_1.hashPassword)(password);
        return await db_1.default.getRepository(User_1.default).save({ email, hashedPassword });
    }
    async login({ email, password }, { res }) {
        const user = await db_1.default.getRepository(User_1.default).findOneBy({ email });
        if (user === null || !(await (0, User_1.verifyPassword)(password, user.hashedPassword)))
            throw new apollo_server_errors_1.ApolloError("invalid credentials", "INVALID_CREDS");
        // https://www.npmjs.com/package/jsonwebtoken
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, env_1.env.JWT_PRIVATE_KEY);
        // https://stackoverflow.com/a/40135050
        res.cookie("token", token, {
            httpOnly: true,
            secure: env_1.env.NODE_ENV === "production",
        });
        return token;
    }
    async logout({ res }) {
        res.clearCookie("token");
        return true;
    }
    async profile({ currentUser }) {
        return currentUser;
    }
    async updateProfile(data, { currentUser }) {
        if (typeof currentUser === "undefined")
            throw new Error("no current user");
        return await db_1.default
            .getRepository(User_1.default)
            .save({ ...currentUser, ...data });
    }
    async sendNotification(id, data) {
        const user = await db_1.default.getRepository(User_1.default).findOne({
            where: { id },
        });
        if (user === null)
            throw new Error("NOT_FOUND");
        if (typeof user.expoNotificationToken === "undefined")
            throw new Error("user has no registered device token");
        const res = await expo.sendPushNotificationsAsync([
            {
                to: user.expoNotificationToken,
                title: data.title,
                body: data.body,
                data: typeof data.JSONPayload === "string"
                    ? JSON.parse(data.JSONPayload)
                    : undefined,
            },
        ]);
        console.log({ res });
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => User_1.default),
    __param(0, (0, type_graphql_1.Arg)("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.UserInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("data")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.UserInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Query)(() => User_1.default),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "profile", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Mutation)(() => User_1.default),
    __param(0, (0, type_graphql_1.Arg)("data")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.UpdateUserInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateProfile", null);
__decorate([
    (0, type_graphql_1.Authorized)([User_1.UserRole.ADMIN]),
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("userId", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("data", { validate: false })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, User_1.NotificationInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "sendNotification", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)(() => User_1.default)
], UserResolver);
exports.default = UserResolver;
