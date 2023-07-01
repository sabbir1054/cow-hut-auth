"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const ApiErrors_1 = __importDefault(require("../../errors/ApiErrors"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const cow_model_1 = require("../modules/cows/cow.model");
const order_model_1 = require("../modules/orders/order.model");
const validateUsersRole = (...requiredRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //get authorization token
        const token = req.headers.authorization;
        if (!token) {
            throw new ApiErrors_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized');
        }
        // verify token
        let verifiedUser = null;
        verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
        req.user = verifiedUser;
        if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
            throw new ApiErrors_1.default(http_status_1.default.FORBIDDEN, 'Forbidden');
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
const validateSpecificUser = (...requiredRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        //get authorization token
        const token = req.headers.authorization;
        if (!token) {
            throw new ApiErrors_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized');
        }
        // verify token
        let verifiedUser = null;
        verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
        req.user = verifiedUser;
        const isCorrectUserRole = requiredRoles.includes(verifiedUser.role);
        if (requiredRoles.length && !isCorrectUserRole) {
            throw new ApiErrors_1.default(http_status_1.default.FORBIDDEN, 'Forbidden');
        }
        let findUser;
        // if admin then this function end here
        if (isCorrectUserRole && verifiedUser.role === 'admin') {
            findUser = verifiedUser;
        }
        // work for specific user
        // this portion for cow routes
        if (verifiedUser.role === 'seller' && req.originalUrl.includes('cows')) {
            findUser = yield cow_model_1.Cow.findOne({
                _id: req.params.id,
                seller: verifiedUser.userId,
            });
        }
        // this portion for orders route
        if (verifiedUser.role === 'seller' &&
            req.originalUrl.includes('orders')) {
            const orderInfo = yield order_model_1.Order.findOne({
                _id: req.params.id,
            }).populate({
                path: 'cow',
                populate: [{ path: 'seller' }],
            });
            const sellerFromDB = (_a = orderInfo === null || orderInfo === void 0 ? void 0 : orderInfo.cow) === null || _a === void 0 ? void 0 : _a.seller;
            if ((sellerFromDB === null || sellerFromDB === void 0 ? void 0 : sellerFromDB._id.toString()) === verifiedUser.userId) {
                findUser = sellerFromDB;
            }
        }
        if (verifiedUser.role === 'buyer') {
            findUser = yield order_model_1.Order.findOne({
                _id: req.params.id,
                buyer: verifiedUser.userId,
            });
        }
        if (!findUser) {
            throw new ApiErrors_1.default(http_status_1.default.FORBIDDEN, 'Forbidden');
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.Auth = {
    validateUsersRole,
    validateSpecificUser,
};
