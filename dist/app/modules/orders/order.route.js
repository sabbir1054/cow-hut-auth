"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const auth_1 = require("../../middlewares/auth");
const validedRequest_1 = __importDefault(require("../../middlewares/validedRequest"));
const order_controller_1 = require("./order.controller");
const order_validation_1 = require("./order.validation");
const router = express_1.default.Router();
router.post('/', (0, validedRequest_1.default)(order_validation_1.OrderValidation.createOrderZodSchema), auth_1.Auth.validateUsersRole(users_1.ENUM_USER_ROLE.BUYER), order_controller_1.OrderController.createOrder);
/* Specific user  ===> Specific Order*/
router.get('/:id', auth_1.Auth.validateSpecificUser(users_1.ENUM_USER_ROLE.SELLER, users_1.ENUM_USER_ROLE.BUYER, users_1.ENUM_USER_ROLE.ADMIN), order_controller_1.OrderController.getSingleOrders);
/* Admin ===> All Order*/
router.get('/', auth_1.Auth.validateUsersRole(users_1.ENUM_USER_ROLE.SELLER, users_1.ENUM_USER_ROLE.BUYER, users_1.ENUM_USER_ROLE.ADMIN), order_controller_1.OrderController.getAllOrders);
exports.OrderRoutes = router;
