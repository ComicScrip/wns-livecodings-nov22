"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const env_1 = require("./env");
const Wilder_1 = __importDefault(require("./entity/Wilder"));
const User_1 = __importDefault(require("./entity/User"));
const Skill_1 = __importDefault(require("./entity/Skill"));
const Grade_1 = __importDefault(require("./entity/Grade"));
const datasource = new typeorm_1.DataSource({
    type: "postgres",
    host: env_1.env.DB_HOST,
    port: env_1.env.DB_PORT,
    username: env_1.env.DB_USER,
    password: env_1.env.DB_PASS,
    database: env_1.env.DB_NAME,
    synchronize: true,
    entities: [Wilder_1.default, User_1.default, Skill_1.default, Grade_1.default],
    logging: ["error"],
});
exports.default = datasource;
