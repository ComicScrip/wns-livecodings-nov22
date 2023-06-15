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
const typeorm_1 = require("typeorm");
const Skill_1 = __importDefault(require("./Skill"));
const Wilder_1 = __importDefault(require("./Wilder"));
let Grade = class Grade {
    id;
    skillId;
    wilderId;
    wilder;
    skill;
    votes;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Grade.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Grade.prototype, "skillId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Grade.prototype, "wilderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Wilder_1.default, (w) => w.grades, { onDelete: "CASCADE" }),
    __metadata("design:type", Wilder_1.default)
], Grade.prototype, "wilder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Skill_1.default, (s) => s.grades, { onDelete: "CASCADE" }),
    __metadata("design:type", Skill_1.default)
], Grade.prototype, "skill", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], Grade.prototype, "votes", void 0);
Grade = __decorate([
    (0, typeorm_1.Entity)()
], Grade);
exports.default = Grade;
