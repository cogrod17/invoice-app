import { Router } from "express";
import { ItemController } from "../controllers";
import { auth } from "../middleware";

const router = Router();

router.put("/item/add/:draft_id", auth, ItemController.addItemsToInvoice);
router.delete("/item/:item_id", auth, ItemController.deleteItemFromInvoice);
router.put("/item/update/:item_id", auth, ItemController.updateItem);

export { router as ItemRouter };
