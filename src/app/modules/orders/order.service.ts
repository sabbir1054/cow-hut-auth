import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiErrors';
import { Cow } from '../cows/cow.model';
import { User } from '../users/users.model';
import { IOrder } from './order.interface';
import { Order } from './order.model';

const createOrderToDB = async (payload: IOrder): Promise<IOrder | null> => {
  // check buyer
  const buyerCurrentBudget = await User.findById(payload.buyer, { budget: 1 });
  if (!buyerCurrentBudget) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Buyer info not found');
  }
  // check cow
  const cowInfo = await Cow.findById(payload.cow, { price: 1, seller: 1 });
  if (!cowInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cow info not found');
  }
  // check seller
  const sellerIncome = await User.findById(cowInfo?.seller, { income: 1 });
  if (!sellerIncome) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Seller info not found');
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
    throw new ApiError(httpStatus.BAD_REQUEST, 'Buyer has not enough money');
  } else {
    //   start transaction
    const session = await mongoose.startSession();

    try {
      session.startTransaction();
      // update cow label to DB
      const updateCow = await Cow.findByIdAndUpdate(
        payload.cow,
        { label: 'sold out' },
        { session }
      );
      if (!updateCow) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to make order');
      }

      // update budget to db
      const updateBudget = await User.findByIdAndUpdate(
        payload.buyer,
        {
          budget: updateBuyerBudget,
        },
        { session }
      );
      if (!updateBudget) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to make order');
      }
      // update income to db
      const updateIncome = await User.findByIdAndUpdate(
        cowInfo?.seller,
        {
          income: sellerUpdateIncomeInfo,
        },
        { session }
      );

      if (!updateIncome) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to make order');
      }

      newOrderResult = await Order.create(payload);

      await session.commitTransaction();
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw error;
    }
  }
  if (newOrderResult) {
    newOrderResult = await Order.findById(newOrderResult._id)
      .populate('buyer')
      .populate({
        path: 'cow',
        populate: [{ path: 'seller' }],
      });
  }
  return newOrderResult;
};

const getAllOrdersFromDB = async (): Promise<IOrder[]> => {
  const result = await Order.find()
    .populate('buyer')
    .populate({ path: 'cow', populate: [{ path: 'seller' }] });
  return result;
};

const getSingleOrdersFromDB = async (id: string): Promise<IOrder | null> => {
  const result = await Order.findById(id)
    .populate('buyer')
    .populate({ path: 'cow', populate: [{ path: 'seller' }] });
  return result;
};

export const OrderService = {
  createOrderToDB,
  getAllOrdersFromDB,
  getSingleOrdersFromDB,
};
