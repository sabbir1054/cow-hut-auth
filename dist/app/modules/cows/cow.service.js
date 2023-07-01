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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const cow_constant_1 = require("./cow.constant");
const cow_model_1 = require("./cow.model");
const createCowsToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // check duplicate cow entry using it is not possible that same user have same name cow
    const checked = yield cow_model_1.Cow.find({ name: payload.name }, { seller: 1 });
    if (checked) {
        if (payload.seller == ((_a = checked[0]) === null || _a === void 0 ? void 0 : _a.seller)) {
            throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, 'This cow is already exist in this seller account');
        }
    }
    if (!(payload === null || payload === void 0 ? void 0 : payload.label)) {
        payload.label = 'for sale';
    }
    const result = (yield cow_model_1.Cow.create(payload)).populate('seller');
    return result;
});
const getAllCowsFromDB = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, maxPrice, minPrice } = filters, filtersData = __rest(filters, ["searchTerm", "maxPrice", "minPrice"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (maxPrice) {
        andConditions.push({
            price: { $lte: maxPrice },
        });
    }
    if (minPrice) {
        andConditions.push({
            price: { $gte: minPrice },
        });
    }
    if (searchTerm) {
        const searchTermRegex = new RegExp(searchTerm, 'i');
        andConditions.push({
            $or: cow_constant_1.cowFilterableFields.map(field => ({
                [field]: {
                    $regex: searchTermRegex,
                    //   options: 'i',
                },
            })),
        });
    }
    if (Object.keys(filtersData).length) {
        Object.entries(filtersData).forEach(([field, value]) => {
            const filterValueRegex = new RegExp(String(value), 'i');
            andConditions.push({ [field]: { $regex: filterValueRegex } });
        });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield cow_model_1.Cow.find(whereConditions)
        .populate('seller')
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield cow_model_1.Cow.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleCowFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cow_model_1.Cow.findById(id);
    return result;
});
const updateCowToDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield cow_model_1.Cow.findById(id);
    if (!isExist) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, 'Cow not Found');
    }
    const result = yield cow_model_1.Cow.findByIdAndUpdate(id, payload, {
        new: true,
    }).populate('seller');
    return result;
});
const deleteCowFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield cow_model_1.Cow.findById(id);
    if (!isExist) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, 'Cow not Found');
    }
    const result = yield cow_model_1.Cow.findByIdAndDelete(id);
    return result;
});
exports.CowService = {
    createCowsToDB,
    getAllCowsFromDB,
    getSingleCowFromDB,
    updateCowToDB,
    deleteCowFromDB,
};
