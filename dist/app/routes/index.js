"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cow_route_1 = require("../modules/cows/cow.route");
const order_route_1 = require("../modules/orders/order.route");
const users_route_1 = require("../modules/users/users.route");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const modulesRoute = [
    {
        path: '/orders/',
        route: order_route_1.OrderRoutes,
    },
    {
        path: '/users/',
        route: users_route_1.UserRoutes,
    },
    {
        path: '/cows/',
        route: cow_route_1.CowRoutes,
    },
];
modulesRoute.map(route => router.use(route.path, route.route));
exports.default = router;
