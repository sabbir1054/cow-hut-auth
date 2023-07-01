"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const auth_1 = require("../../middlewares/auth");
const validedRequest_1 = __importDefault(require("../../middlewares/validedRequest"));
const cow_controller_1 = require("./cow.controller");
const cow_validation_1 = require("./cow.validation");
const router = express_1.default.Router();
router.post('/', (0, validedRequest_1.default)(cow_validation_1.CowValidation.createCowZodValidation), auth_1.Auth.validateUsersRole(users_1.ENUM_USER_ROLE.SELLER), cow_controller_1.CowController.createCows);
router.patch('/:id', (0, validedRequest_1.default)(cow_validation_1.CowValidation.updateCowZodValidation), auth_1.Auth.validateSpecificUser(users_1.ENUM_USER_ROLE.SELLER), cow_controller_1.CowController.updateCow);
router.delete('/:id', auth_1.Auth.validateSpecificUser(users_1.ENUM_USER_ROLE.SELLER), cow_controller_1.CowController.deleteCow);
router.get('/:id', auth_1.Auth.validateUsersRole(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.BUYER, users_1.ENUM_USER_ROLE.SELLER), cow_controller_1.CowController.getSingleCow);
router.get('/', auth_1.Auth.validateUsersRole(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.BUYER, users_1.ENUM_USER_ROLE.SELLER), cow_controller_1.CowController.getAllCows);
exports.CowRoutes = router;
