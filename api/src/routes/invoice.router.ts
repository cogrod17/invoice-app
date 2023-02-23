import { Router } from "express";
import { InvoiceController } from "../controllers";
import { auth } from "../middleware";

const router = Router();

router.post("/draft/create", auth, InvoiceController.createInvoice);
router.delete("/draft/delete/draft_id", auth, InvoiceController.deleteInvoice);

export { router as InvoiceRouter };
