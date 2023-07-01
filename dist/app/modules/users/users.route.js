"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const auth_1 = require("../../middlewares/auth");
const validedRequest_1 = __importDefault(require("../../middlewares/validedRequest"));
const users_controller_1 = require("./users.controller");
const users_validation_1 = require("./users.validation");
const router = express_1.default.Router();
// my profile
router.get('/my-profile', auth_1.Auth.validateUsersRole(users_1.ENUM_USER_ROLE.BUYER, users_1.ENUM_USER_ROLE.SELLER), users_controller_1.UserController.getMyProfile);
router.patch('/my-profile', (0, validedRequest_1.default)(users_validation_1.UserValidation.updateUserZodSchema), auth_1.Auth.validateUsersRole(users_1.ENUM_USER_ROLE.BUYER, users_1.ENUM_USER_ROLE.SELLER), users_controller_1.UserController.updateMyProfile);
router.post('/signup', (0, validedRequest_1.default)(users_validation_1.UserValidation.createUserZodSchema), users_controller_1.UserController.createUser);
router.delete('/:id', auth_1.Auth.validateUsersRole(users_1.ENUM_USER_ROLE.ADMIN), users_controller_1.UserController.deleteUser);
router.patch('/:id', (0, validedRequest_1.default)(users_validation_1.UserValidation.updateUserZodSchema), auth_1.Auth.validateUsersRole(users_1.ENUM_USER_ROLE.ADMIN), users_controller_1.UserController.updateUser);
router.get('/:id', auth_1.Auth.validateUsersRole(users_1.ENUM_USER_ROLE.ADMIN), users_controller_1.UserController.getSingleUser);
router.get('/', auth_1.Auth.validateUsersRole(users_1.ENUM_USER_ROLE.ADMIN), users_controller_1.UserController.getAllUsers);
exports.UserRoutes = router;
