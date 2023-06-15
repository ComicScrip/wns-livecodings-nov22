"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const db_1 = __importDefault(require("./db"));
const apollo_server_1 = require("apollo-server");
const apollo_server_core_1 = require("apollo-server-core");
const type_graphql_1 = require("type-graphql");
const path_1 = require("path");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("./env");
const User_1 = __importDefault(require("./entity/User"));
const cookie_1 = __importDefault(require("cookie"));
async function start() {
    await db_1.default.initialize();
    const schema = await (0, type_graphql_1.buildSchema)({
        resolvers: [(0, path_1.join)(__dirname, "/resolvers/*.ts")],
        authChecker: async ({ context }, roles = []) => {
            const { req } = context;
            const tokenInAuthHeaders = req.headers.authorization?.split(" ")[1];
            const tokenInCookie = cookie_1.default.parse(req.headers.cookie ?? "").token;
            console.log({ tokenInAuthHeaders, tokenInCookie });
            const token = tokenInAuthHeaders ?? tokenInCookie;
            console.log({ tokenInAuthHeaders, tokenInCookie });
            if (typeof token !== "string")
                return false;
            const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_PRIVATE_KEY);
            if (typeof decoded !== "object")
                return false;
            const id = decoded.userId;
            const currentUser = await db_1.default.getRepository(User_1.default).findOneBy({ id });
            if (currentUser === null)
                return false;
            context.currentUser = currentUser;
            return roles.length === 0 || roles.includes(currentUser.role);
        },
    });
    const server = new apollo_server_1.ApolloServer({
        schema,
        csrfPrevention: true,
        cache: "bounded",
        plugins: [(0, apollo_server_core_1.ApolloServerPluginLandingPageLocalDefault)({ embed: true })],
        context: ({ req, res }) => ({ req, res }),
        cors: {
            origin: env_1.env.CORS_ALLOWED_ORIGINS.split(","),
            credentials: true,
        },
    });
    await server.listen().then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    });
}
start().catch(console.error);
