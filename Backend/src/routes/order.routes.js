import {Router} from "express";
import {authenticate} from "../middleware/auth.middleware.js"
import {authorizeAdmin} from "../middleware/admin.middleware.js"
import * as orderController from "../controllers/order.controller.js"

const orderRouter = Router();

orderRouter.post('/', authenticate , orderController.placeOrder);
orderRouter.get('/',authenticate, authorizeAdmin, orderController.getAllOrders);
orderRouter.get('/my-orders',authenticate, orderController.myOrders);
orderRouter.patch('/:id/status', authenticate, authorizeAdmin, orderController.updateOrderStatus);
orderRouter.patch('/:id/cancel',authenticate, orderController.cancelOrder);
orderRouter.post('/buy-now',authenticate , orderController.buyNow);
orderRouter.patch('/:id/payment',authenticate, authorizeAdmin , orderController.updatePaymentStatus);


export default orderRouter;



