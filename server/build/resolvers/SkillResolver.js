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
exports.SkillResolver = void 0;
const type_graphql_1 = require("type-graphql");
const apollo_server_errors_1 = require("apollo-server-errors");
const Skill_1 = __importStar(require("../entity/Skill"));
const db_1 = __importDefault(require("../db"));
let SkillResolver = class SkillResolver {
    async skills() {
        return await db_1.default.getRepository(Skill_1.default).find();
    }
    async createSkill(data) {
        return await db_1.default.getRepository(Skill_1.default).save(data);
    }
    async deleteSkill(id) {
        const { affected } = await db_1.default.getRepository(Skill_1.default).delete(id);
        if (affected === 0)
            throw new apollo_server_errors_1.ApolloError("skill not found", "NOT_FOUND");
        return true;
    }
    async updateSkill(id, { name }) {
        const { affected } = await db_1.default
            .getRepository(Skill_1.default)
            .update(id, { name });
        if (affected === 0)
            throw new apollo_server_errors_1.ApolloError("skill not found", "NOT_FOUND");
        return { id, name };
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Skill_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SkillResolver.prototype, "skills", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Skill_1.default),
    __param(0, (0, type_graphql_1.Arg)("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Skill_1.SkillInput]),
    __metadata("design:returntype", Promise)
], SkillResolver.prototype, "createSkill", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SkillResolver.prototype, "deleteSkill", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Skill_1.default),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Skill_1.SkillInput]),
    __metadata("design:returntype", Promise)
], SkillResolver.prototype, "updateSkill", null);
SkillResolver = __decorate([
    (0, type_graphql_1.Resolver)(Skill_1.default)
], SkillResolver);
exports.SkillResolver = SkillResolver;
