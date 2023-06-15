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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WilderUpdateInput = exports.WilderInput = exports.SkillId = void 0;
const type_graphql_1 = require("type-graphql");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const Grade_1 = __importDefault(require("./Grade"));
let SkillOfWilder = class SkillOfWilder {
    id;
    name;
    votes;
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], SkillOfWilder.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], SkillOfWilder.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], SkillOfWilder.prototype, "votes", void 0);
SkillOfWilder = __decorate([
    (0, type_graphql_1.ObjectType)()
], SkillOfWilder);
let Wilder = class Wilder {
    id;
    name;
    city;
    avatarUrl;
    bio;
    skills;
    grades;
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Wilder.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Wilder.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true, length: 100, type: "varchar" }),
    __metadata("design:type", String)
], Wilder.prototype, "city", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true, length: 100, type: "varchar" }),
    __metadata("design:type", String)
], Wilder.prototype, "avatarUrl", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true, type: "text" }),
    __metadata("design:type", String)
], Wilder.prototype, "bio", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [SkillOfWilder]),
    __metadata("design:type", Array)
], Wilder.prototype, "skills", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Grade_1.default, (g) => g.wilder),
    __metadata("design:type", Array)
], Wilder.prototype, "grades", void 0);
Wilder = __decorate([
    (0, typeorm_1.Entity)(),
    (0, type_graphql_1.ObjectType)()
], Wilder);
let SkillId = class SkillId {
    id;
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], SkillId.prototype, "id", void 0);
SkillId = __decorate([
    (0, type_graphql_1.InputType)()
], SkillId);
exports.SkillId = SkillId;
let WilderInput = class WilderInput {
    name;
    city;
    bio;
    avatarUrl;
    skills;
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], WilderInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], WilderInput.prototype, "city", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], WilderInput.prototype, "bio", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], WilderInput.prototype, "avatarUrl", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, type_graphql_1.Field)(() => [SkillId], { nullable: true }),
    __metadata("design:type", Array)
], WilderInput.prototype, "skills", void 0);
WilderInput = __decorate([
    (0, type_graphql_1.InputType)()
], WilderInput);
exports.WilderInput = WilderInput;
let WilderUpdateInput = class WilderUpdateInput {
    name;
    city;
    bio;
    avatarUrl;
    skills;
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], WilderUpdateInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], WilderUpdateInput.prototype, "city", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], WilderUpdateInput.prototype, "bio", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], WilderUpdateInput.prototype, "avatarUrl", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, type_graphql_1.Field)(() => [SkillId], { nullable: true }),
    __metadata("design:type", Array)
], WilderUpdateInput.prototype, "skills", void 0);
WilderUpdateInput = __decorate([
    (0, type_graphql_1.InputType)()
], WilderUpdateInput);
exports.WilderUpdateInput = WilderUpdateInput;
exports.default = Wilder;
