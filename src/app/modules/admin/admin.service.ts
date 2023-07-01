import { IAdmin } from './admin.interface';
import { Admin } from './admin.model';

const createAdminToDB = async (payload: IAdmin): Promise<IAdmin | null> => {
  const result = await Admin.create(payload);
  return result;
};

export const AdminService = {
  createAdminToDB,
};
