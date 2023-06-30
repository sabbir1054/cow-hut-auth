import { CowRoutes } from '../modules/cows/cow.route';
import { OrderRoutes } from '../modules/orders/order.route';
import { UserRoutes } from '../modules/users/users.route';

import express from 'express';

const router = express.Router();

const modulesRoute = [
  {
    path: '/orders/',
    route: OrderRoutes,
  },
  {
    path: '/users/',
    route: UserRoutes,
  },
  {
    path: '/cows/',
    route: CowRoutes,
  },
];

modulesRoute.map(route => router.use(route.path, route.route));

export default router;
