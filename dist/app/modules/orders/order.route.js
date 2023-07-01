"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validedRequest_1 = __importDefault(require("../../middlewares/validedRequest"));
const order_controller_1 = require("./order.controller");
const order_validation_1 = require("./order.validation");
const router = express_1.default.Router();
router.post('/', (0, validedRequest_1.default)(order_validation_1.OrderValidation.createOrderZodSchema), order_controller_1.OrderController.createOrder);
router.get('/', order_controller_1.OrderController.getAllOrders);
exports.OrderRoutes = router;
