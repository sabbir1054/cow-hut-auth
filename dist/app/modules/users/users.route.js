"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validedRequest_1 = __importDefault(require("../../middlewares/validedRequest"));
const users_controller_1 = require("./users.controller");
const users_validation_1 = require("./users.validation");
const router = express_1.default.Router();
router.post('/signup', (0, validedRequest_1.default)(users_validation_1.UserValidation.createUserZodSchema), users_controller_1.UserController.createUser);
router.delete('/:id', users_controller_1.UserController.deleteUser);
router.patch('/:id', users_controller_1.UserController.updateUser);
router.get('/:id', users_controller_1.UserController.getSingleUser);
router.get('/', users_controller_1.UserController.getAllUsers);
exports.UserRoutes = router;
