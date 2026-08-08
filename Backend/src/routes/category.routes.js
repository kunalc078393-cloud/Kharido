import { Router } from "express";
import * as categoryController from "../controllers/category.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeAdmin } from "../middleware/admin.middleware.js";

const categoryRouter = Router();

categoryRouter.post("/",authenticate, authorizeAdmin, categoryController.createCategory);
categoryRouter.get("/", categoryController.getCategories);
categoryRouter.get("/:id", categoryController.getCategory);
categoryRouter.put("/:id",authenticate, authorizeAdmin, categoryController.updateCategory);
categoryRouter.delete("/:id", authenticate, authorizeAdmin, categoryController.deleteCategory);


export default categoryRouter;
