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
exports.WilderResolver = void 0;
const type_graphql_1 = require("type-graphql");
const apollo_server_errors_1 = require("apollo-server-errors");
const Wilder_1 = __importStar(require("../entity/Wilder"));
const db_1 = __importDefault(require("../db"));
const Grade_1 = __importDefault(require("../entity/Grade"));
const typeorm_1 = require("typeorm");
const User_1 = require("../entity/User");
let WilderResolver = class WilderResolver {
    async wilders() {
        const wilders = await db_1.default
            .getRepository(Wilder_1.default)
            .find({ relations: { grades: { skill: true } } });
        return wilders.map((w) => ({
            ...w,
            skills: w.grades.map((g) => ({
                id: g.skill.id,
                name: g.skill.name,
                votes: g.votes,
            })),
        }));
    }
    async wilder(id) {
        const wilder = await db_1.default
            .getRepository(Wilder_1.default)
            .findOne({ where: { id }, relations: { grades: { skill: true } } });
        if (wilder === null)
            throw new apollo_server_errors_1.ApolloError("wilder not found", "NOT_FOUND");
        return {
            ...wilder,
            skills: wilder.grades.map((g) => ({
                id: g.skill.id,
                name: g.skill.name,
                votes: g.votes,
            })),
        };
    }
    async createWilder(data) {
        const { name, avatarUrl, bio, city, skills = [] } = data;
        const { id } = await db_1.default.getRepository(Wilder_1.default).save({
            name,
            avatarUrl,
            bio,
            city,
        });
        if (typeof skills === "object")
            await db_1.default.getRepository(Grade_1.default).save(skills.map(({ id: skillId }) => ({
                skillId,
                wilderId: id,
            })));
        const toReturn = await db_1.default.getRepository(Wilder_1.default).findOneOrFail({
            where: { id },
            relations: { grades: { skill: true } },
        });
        toReturn.skills = toReturn.grades.map(({ skill, votes }) => ({
            ...skill,
            votes,
        }));
        return toReturn;
    }
    async deleteWilder(id) {
        const { affected } = await db_1.default.getRepository(Wilder_1.default).delete(id);
        if (affected === 0)
            throw new apollo_server_errors_1.ApolloError("wilder not found", "NOT_FOUND");
        return true;
    }
    async updateWilder(id, data) {
        const { name, bio, avatarUrl, city, skills } = data;
        const wilderToUpdate = await db_1.default.getRepository(Wilder_1.default).findOne({
            where: { id },
            relations: { grades: { skill: true } },
        });
        if (wilderToUpdate === null)
            throw new apollo_server_errors_1.ApolloError("wilder not found", "NOT_FOUND");
        await db_1.default
            .getRepository(Wilder_1.default)
            .save({ id, name, bio, city, avatarUrl });
        const existingSkillIds = wilderToUpdate.grades.map((g) => g.skill.id);
        const newSkillIds = (typeof skills === "undefined" ? [] : skills).map((s) => s.id);
        const skillIdsToAdd = newSkillIds.filter((newId) => !existingSkillIds.includes(newId));
        const skillsToRemove = existingSkillIds.filter((existingId) => !newSkillIds.includes(existingId));
        await db_1.default.getRepository(Grade_1.default).save(skillIdsToAdd.map((skillId) => ({
            skillId,
            wilderId: wilderToUpdate.id,
        })));
        if (typeof skills === "object")
            await db_1.default
                .getRepository(Grade_1.default)
                .delete({ wilderId: wilderToUpdate.id, skillId: (0, typeorm_1.In)(skillsToRemove) });
        const toReturn = await db_1.default.getRepository(Wilder_1.default).findOneOrFail({
            where: { id },
            relations: { grades: { skill: true } },
        });
        toReturn.skills = toReturn.grades.map(({ skill, votes }) => ({
            ...skill,
            votes,
        }));
        return toReturn;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Wilder_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WilderResolver.prototype, "wilders", null);
__decorate([
    (0, type_graphql_1.Query)(() => Wilder_1.default),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WilderResolver.prototype, "wilder", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Wilder_1.default),
    __param(0, (0, type_graphql_1.Arg)("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Wilder_1.WilderInput]),
    __metadata("design:returntype", Promise)
], WilderResolver.prototype, "createWilder", null);
__decorate([
    (0, type_graphql_1.Authorized)([User_1.UserRole.ADMIN]),
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WilderResolver.prototype, "deleteWilder", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Wilder_1.default),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Wilder_1.WilderUpdateInput]),
    __metadata("design:returntype", Promise)
], WilderResolver.prototype, "updateWilder", null);
WilderResolver = __decorate([
    (0, type_graphql_1.Resolver)(Wilder_1.default)
], WilderResolver);
exports.WilderResolver = WilderResolver;
