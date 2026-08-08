import * as productController from "../controllers/product.controller.js";;
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {authorizeAdmin} from "../middleware/admin.middleware.js";

const productRouter = Router();

productRouter.post('/',authenticate, authorizeAdmin, productController.createProduct);
productRouter.get('/', productController.getProducts );
productRouter.get('/:id',productController.getProductsById);
productRouter.put('/:id',authenticate , authorizeAdmin , productController.updateProduct);
productRouter.delete('/:id',authenticate , authorizeAdmin , productController.deleteProduct);

export default productRouter;
