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
exports.OrderService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const cow_model_1 = require("../cows/cow.model");
const users_model_1 = require("../users/users.model");
const order_model_1 = require("./order.model");
const createOrderToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check buyer
    const buyerCurrentBudget = yield users_model_1.User.findById(payload.buyer, { budget: 1 });
    if (!buyerCurrentBudget) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, 'Buyer info not found');
    }
    // check cow
    const cowInfo = yield cow_model_1.Cow.findById(payload.cow, { price: 1, seller: 1 });
    if (!cowInfo) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, 'Cow info not found');
    }
    // check seller
    const sellerIncome = yield users_model_1.User.findById(cowInfo === null || cowInfo === void 0 ? void 0 : cowInfo.seller, { income: 1 });
    if (!sellerIncome) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, 'Seller info not found');
    }
    let newOrderResult;
    let hasEnoughMoney = false;
    let updateBuyerBudget;
    let sellerUpdateIncomeInfo;
    if (buyerCurrentBudget && cowInfo) {
        hasEnoughMoney = Number(cowInfo.price) <= Number(buyerCurrentBudget.budget);
        updateBuyerBudget =
            Number(buyerCurrentBudget.budget) - Number(cowInfo.price);
        if (sellerIncome) {
            sellerUpdateIncomeInfo =
                Number(sellerIncome.income) + Number(cowInfo.price);
        }
    }
    if (!hasEnoughMoney) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, 'Buyer has not enough money');
    }
    else {
        //   start transaction
        const session = yield mongoose_1.default.startSession();
        try {
            session.startTransaction();
            // update cow label to DB
            const updateCow = yield cow_model_1.Cow.findByIdAndUpdate(payload.cow, { label: 'sold out' }, { session });
            if (!updateCow) {
                throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, 'Failed to make order');
            }
            // update budget to db
            const updateBudget = yield users_model_1.User.findByIdAndUpdate(payload.buyer, {
                budget: updateBuyerBudget,
            }, { session });
            if (!updateBudget) {
                throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, 'Failed to make order');
            }
            // update income to db
            const updateIncome = yield users_model_1.User.findByIdAndUpdate(cowInfo === null || cowInfo === void 0 ? void 0 : cowInfo.seller, {
                income: sellerUpdateIncomeInfo,
            }, { session });
            if (!updateIncome) {
                throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, 'Failed to make order');
            }
            newOrderResult = yield order_model_1.Order.create(payload);
            yield session.commitTransaction();
            yield session.endSession();
        }
        catch (error) {
            yield session.abortTransaction();
            yield session.endSession();
            throw error;
        }
    }
    if (newOrderResult) {
        newOrderResult = yield order_model_1.Order.findById(newOrderResult._id)
            .populate('buyer')
            .populate({
            path: 'cow',
            populate: [{ path: 'seller' }],
        });
    }
    return newOrderResult;
});
const getAllOrdersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.find()
        .populate('buyer')
        .populate({ path: 'cow', populate: [{ path: 'seller' }] });
    return result;
});
exports.OrderService = {
    createOrderToDB,
    getAllOrdersFromDB,
};
