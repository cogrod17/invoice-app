import { Router } from "express";
import { UserController } from "../controllers";
import { auth } from "../middleware";

const router = Router();

router.post("/user/login", UserController.login);
router.post("/user/create", UserController.createUser);
router.get("/user/:id", auth, UserController.getUser);
router.put("/user/update/:id", auth, UserController.updateUser);
router.delete("/user/delete/:id", auth, UserController.deleteUser);
router.post("/user/reset_password/:id", auth, UserController.setPassword);

export { router as UserRouter };
