import * as cartController from "../controllers/cart.controller.js"
import { Router } from "express"
import { authorizeAdmin } from "../middleware/admin.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";

const cartRouter = Router();

cartRouter.get('/',authenticate, cartController.getCart);
cartRouter.post('/',authenticate , cartController.addToCart);
cartRouter.patch('/:id',authenticate , cartController.updateCartItem);
cartRouter.delete('/:id',authenticate, cartController.removeCartItem);
cartRouter.delete('/', authenticate, cartController.clearCart);


export default cartRouter;