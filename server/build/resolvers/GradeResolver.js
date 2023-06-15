"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.GradeResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Grade_1 = __importDefault(require("../entity/Grade"));
const db_1 = __importDefault(require("../db"));
const apollo_server_errors_1 = require("apollo-server-errors");
let GradeResolver = class GradeResolver {
    async updateGrade(wilderId, skillId, votes) {
        const grade = await db_1.default.getRepository(Grade_1.default).findOne({
            where: { wilderId, skillId },
        });
        if (grade === null)
            throw new apollo_server_errors_1.ApolloError("grade not found", "NOT_FOUND");
        grade.votes = votes;
        await db_1.default.getRepository(Grade_1.default).save(grade);
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("wilderId", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("skillId", () => type_graphql_1.Int)),
    __param(2, (0, type_graphql_1.Arg)("votes", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], GradeResolver.prototype, "updateGrade", null);
GradeResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], GradeResolver);
exports.GradeResolver = GradeResolver;
